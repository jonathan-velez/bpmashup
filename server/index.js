const dotenv = require('dotenv');
const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const Bull = require('bull');
const admin = require('firebase-admin');

dotenv.load({ path: '.env' });

const constants = require('./config/constants');
const {
  API_BASE_URL,
  USER_PROFILE_PHOTO_UPLOAD_PATH,
  BULL_PROCESS_CONCURRENCY,
} = constants;

const firebaseAdmin = require('./controllers/firebaseAdminSDKController');
const firebaseInstance = firebaseAdmin.firebaseInstance();
const firestore = firebaseInstance.firestore();

const staticFiles = express.static(path.join(__dirname, '../client/build'));
app.use(staticFiles);

const bpController = require('./controllers/beatportController');
const zippyController = require('./controllers/zippyController');
const ytController = require('./controllers/youtubeController');
const songkickController = require('./controllers/songkickController');
const lastFmController = require('./controllers/lastFmController');
const profilePhotoUploadController = require('./controllers/profilePhotoUploadController');

app.use(bodyParser.urlencoded({ extended: false }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, USER_PROFILE_PHOTO_UPLOAD_PATH + '/');
  },
  filename: (req, file, cb) => {
    const { uid } = req.body;
    cb(null, `${uid}-${file.originalname}`); // TODO: Change this to a subdirectory. in destination fn above 'mkdir' with uid.
  },
});
const upload = multer({ storage });

app.get(`${API_BASE_URL}/genres`, bpController.callApi);
app.get(`${API_BASE_URL}/search`, bpController.callApi);
app.get(`${API_BASE_URL}/most-popular`, bpController.callApi);
app.get(`${API_BASE_URL}/most-popular/:type`, bpController.callApi);
app.get(`${API_BASE_URL}/autocomplete`, bpController.callApi);
app.get(`${API_BASE_URL}/artists/detail`, bpController.callApi);
app.get(`${API_BASE_URL}/tracks`, bpController.callApi);
app.get(`${API_BASE_URL}/tracks/similar`, bpController.callApi);
app.get(`${API_BASE_URL}/labels`, bpController.getLabelData);
app.get(`${API_BASE_URL}/releases`, bpController.callApi);
app.get(`${API_BASE_URL}/artist`, bpController.getArtistData);
app.get(`${API_BASE_URL}/most-popular-releases/:type`, bpController.callApi);
app.get(`${API_BASE_URL}/my-beatport`, bpController.callApi);
app.get(`${API_BASE_URL}/charts`, bpController.callApi);
app.get(`${API_BASE_URL}/profile/charts`, bpController.callApi);
app.get(`${API_BASE_URL}/download-track`, zippyController.zippyScrape);
app.get(`${API_BASE_URL}/youtube/search-v2`, ytController.searchv2);
app.get(
  `${API_BASE_URL}/songkick/get-artist-id`,
  songkickController.getArtistId,
);
app.get(
  `${API_BASE_URL}/songkick/get-artist-events`,
  songkickController.getUpcomingEvents,
);
app.get(
  `${API_BASE_URL}/last-fm/get-artist-info`,
  lastFmController.getArtistInfo,
);
app.get(`${API_BASE_URL}/download-it`, zippyController.downloadIt);
app.post(
  `${API_BASE_URL}/profile-photo-upload`,
  upload.single('photoFile'),
  profilePhotoUploadController.processFileUpload,
);
app.get(`${API_BASE_URL}/file-exists`, zippyController.fileExists);

app.use('/downloads', express.static(path.join(__dirname, '/downloads')));
app.use(
  `/profile-photos`,
  express.static(path.join(__dirname, `/${USER_PROFILE_PHOTO_UPLOAD_PATH}`)),
);
app.use('/*', staticFiles);

app.set('port', process.env.PORT || 3001);
app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`);
});

// listen for new additions to the download queue and send to redis
const { REDIS_URL } = process.env;
const downloadQueue = new Bull('download-queue', REDIS_URL);

const downloadQueueGlobalRef = firestore
  .collection('downloadQueue')
  .where('status', '==', 'initiated');

downloadQueueGlobalRef.onSnapshot((snapshot) => {
  console.log('Registering firestore listener on global download queue.');
  snapshot.forEach((item) => {
    console.log(
      `Processing new item added to global download queue. Item ID: ${item.id}`,
    );

    // add item to Bull queue
    const itemData = item.data();
    const queueItem = {
      ...itemData,
      key: item.id,
      options: {
        attempts: 2,
      },
    };

    downloadQueue.add(queueItem);

    // update items to "queued" in Firestore
    const { addedBy } = itemData;
    const batch = firestore.batch();

    const globalRef = firestore.collection('downloadQueue').doc(item.id);
    batch.set(globalRef, { status: 'queued' }, { merge: true });

    const userRef = firestore
      .collection('users')
      .doc(addedBy)
      .collection('downloadQueue')
      .doc(item.id);
    batch.set(userRef, { status: 'queued' }, { merge: true });

    batch
      .commit()
      .then(() =>
        console.log(`Successfully updated Firestore for item ${item.id}`),
      )
      .catch(
        (error) => `Error updating Firestore for item ${item.id}: ${error}`,
      );
  });
});

downloadQueue.process(BULL_PROCESS_CONCURRENCY, async (job) => {
  return await processDownloadJob(job.data);
});

function processDownloadJob(data) {
  return new Promise(async (resolve) => {
    // update queued item as 'available' in Firestore
    const { key, searchTerms, track = {} } = data;
    const { artists, name, mixName } = searchTerms;
    let isYouTube = false;

    let response = await zippyController.getDownladLink({
      artists,
      name,
      mixName,
    });

    console.log('zippy response', response);

    // fallback to youtube if zippy fails
    if (!response.success) {
      console.log('zippy failed, try YT');
      const searchString = [artists, name, mixName].join(' ');
      response = await ytController.getYouTubeLink(searchString, track.lengthMs);
      isYouTube = true;
    }

    let { success, href, fileName } = response;

    const updateData = {
      queueId: key,
      status: success ? 'available' : 'notAvailable',
      url: success ? href : null,
      dateProcessed: admin.firestore.Timestamp.now(),
      fileName: fileName || null,
      isYouTube,
    };

    // update firesstore
    // TODO: If failed, add reason. e.g. No google hits, No suitable zippy hits, etc.
    // zippy response { href: null, success: false, error: 'No file found' }
    const batch = firestore.batch();
    const globalRef = firestore.collection('downloadQueue').doc(data.key);
    batch.update(globalRef, updateData);

    const userRef = firestore
      .collection('users')
      .doc(data.addedBy)
      .collection('downloadQueue')
      .doc(data.key);
    batch.update(userRef, updateData);
    batch
      .commit()
      .then(() => resolve({ ...updateData, success: true }))
      .catch(() => resolve({ ...updateData, success: false }));

    resolve({ success: true });
  });
}

downloadQueue.on('completed', (job, result) => {
  console.log(`Job completed with result ${JSON.stringify(result)}`);
});
