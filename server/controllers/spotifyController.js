const axios = require('axios');
const SpotifyWebApi = require('spotify-web-api-node');

const SPOTIFY_CLIENT_ID = '5cb7ddeef8404b3bb847578bb9704d27';
const SPOTIFY_CLIENT_SECRET = 'b3f3dd477e8d4633812b73431f516afc';
const SPOTIFY_REDIRECT_URL = '/spotify-callback';

const getTrack = async (req, res) => {
  const { searchTerm } = req.query;
  // remove "feat. xxx" from titles, seems to be broken
  // remove (Original Mix) - check track.mixName !== 'Original Mix' or 'Extended Mix'

  const spotifyApi = new SpotifyWebApi({
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    redirectUri: SPOTIFY_REDIRECT_URL,
  });

  const accessToken = await getToken();
  spotifyApi.setAccessToken(accessToken);

  try {
    const track = await spotifyApi.searchTracks(searchTerm, { limit: 1 });
    console.log(JSON.stringify(track.body.tracks))
    res.json(Object.assign({ success: true }, track.body.tracks));
  } catch (error) {
    console.error(error)
    res.json({ success: false, items: [] });
  }
}

const convertToBase64 = data => {
  const buff = new Buffer(data);
  const base64data = buff.toString('base64');
  return base64data;
}

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
      resolve(response.data.access_token);
    } catch (error) {
      console.log('Error getting token', error);
      reject();
    }
  })
}

exports.getTrack = getTrack;
