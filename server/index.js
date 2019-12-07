const dotenv = require('dotenv');
const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');

dotenv.load({ path: '.env' });

const constants = require('./config/constants');
const { API_BASE_URL, USER_PROFILE_PHOTO_UPLOAD_PATH } = constants;

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
  }
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
app.get(`${API_BASE_URL}/labels`, bpController.callApi);
app.get(`${API_BASE_URL}/releases`, bpController.callApi);
app.get(`${API_BASE_URL}/artist`, bpController.getArtistData);
app.get(`${API_BASE_URL}/most-popular-releases/:type`, bpController.callApi);
app.get(`${API_BASE_URL}/my-beatport`, bpController.callApi);
app.get(`${API_BASE_URL}/charts`, bpController.callApi);
app.get(`${API_BASE_URL}/download-track`, zippyController.zippyScrape);
app.get(`${API_BASE_URL}/youtube/search`, ytController.Youtube);
app.get(`${API_BASE_URL}/songkick/get-artist-id`, songkickController.getArtistId);
app.get(`${API_BASE_URL}/songkick/get-artist-events`, songkickController.getUpcomingEvents);
app.get(`${API_BASE_URL}/last-fm/get-artist-info`, lastFmController.getArtistInfo);
app.get(`${API_BASE_URL}/download-it`, zippyController.downloadIt);
app.post(`${API_BASE_URL}/profile-photo-upload`, upload.single('photoFile'), profilePhotoUploadController.processFileUpload);

app.use('/downloads', express.static(path.join(__dirname, '/downloads')));
app.use(`/profile-photos`, express.static(path.join(__dirname, `/${USER_PROFILE_PHOTO_UPLOAD_PATH}`)));
app.use('/*', staticFiles);

app.set('port', (process.env.PORT || 3001));
app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`);
});
