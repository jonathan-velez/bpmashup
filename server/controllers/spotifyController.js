const axios = require('axios');
const moment = require('moment');
const SpotifyWebApi = require('spotify-web-api-node');

const SPOTIFY_CLIENT_ID = '5cb7ddeef8404b3bb847578bb9704d27';
const SPOTIFY_CLIENT_SECRET = 'b3f3dd477e8d4633812b73431f516afc';
const SPOTIFY_REDIRECT_URL = '/spotify-callback';

const spotifyApi = new SpotifyWebApi({
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_CLIENT_SECRET,
  redirectUri: SPOTIFY_REDIRECT_URL,
});

const convertToBase64 = data => {
  const buff = new Buffer(data);
  const base64data = buff.toString('base64');
  return base64data;
}

let tokenExpiration = null;

const getToken = async () => {
  return new Promise(async (resolve, reject) => {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const credentials = convertToBase64(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
    const headers = {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    const bodyData = 'grant_type=client_credentials';

    try {
      const response = await axios.post(tokenUrl, bodyData, { headers });
      console.log(response.data);
      resolve(response.data);
    } catch (error) {
      console.log('Error getting token', error);
      reject();
    }
  })
}

// TODO: Wrap this
getToken().then(data => {
  spotifyApi.setAccessToken(data.access_token);
  tokenExpiration = moment().add(data.expires_in, 'seconds');
}).catch(error => {
  console.log(`Error creating/setting access token: ${error}`);
})

const getTrack = async (req, res) => {
  const { searchTerm } = req.query;
  // remove "feat. xxx" from titles, seems to be broken
  // remove (Original Mix) - check track.mixName !== 'Original Mix' or 'Extended Mix'

  //check token logic
  if (moment().isAfter(tokenExpiration)) {
    console.log('token expired, get another');
    const accessToken = await getToken();
    spotifyApi.setAccessToken(accessToken.access_token);
  }

  const trackObj = await searchTracks(searchTerm);
  const { id } = trackObj.items[0];

  res.json(await getAudioAnalysisForTrack(id));
}

const createSpotifyInstance = async () => {
  const spotifyApi = new SpotifyWebApi({
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    redirectUri: SPOTIFY_REDIRECT_URL,
  });

  const accessToken = await getToken();
  spotifyApi.setAccessToken(accessToken);

  return spotifyApi;
}

const searchTracks = async searchTerm => {
  // const spotifyApi = await createSpotifyInstance();

  try {
    const track = await spotifyApi.searchTracks(searchTerm, { limit: 1 });
    console.log(track.body.tracks);
    return Object.assign({ success: true }, track.body.tracks);
  } catch (error) {
    console.error(error)
    return { success: false, items: [] };
  }
}

const getAudioAnalysisForTrack = async trackId => {
  // const spotifyApi = await createSpotifyInstance();
  const trackDetails = await spotifyApi.getAudioAnalysisForTrack(trackId);
  console.log(trackDetails.body.meta);
  return (trackDetails);
}

spotifyApi.getRefreshToken()

exports.getTrack = getTrack;
