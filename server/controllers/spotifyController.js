const axios = require('axios');
const SpotifyWebApi = require('spotify-web-api-node');

const SPOTIFY_CLIENT_ID = '5cb7ddeef8404b3bb847578bb9704d27';
const SPOTIFY_CLIENT_SECRET = 'b3f3dd477e8d4633812b73431f516afc';
const SPOTIFY_REDIRECT_URL = '/spotify-callback';
// const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1/';
// const SPOTIFY_PATH_SEARCH = 'search';


const main = async () => {
  const spotifyApi = new SpotifyWebApi({
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    redirectUri: SPOTIFY_REDIRECT_URL,
  });

  const accessToken = await getToken();
  spotifyApi.setAccessToken(accessToken);

  const firstTest = async () => {
    const searchTerm = 'pryda';

    // try {
    //   spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
    //     function (data) {
    //       console.log('Artist albums', data.body);
    //     },
    //     function (err) {
    //       console.error(err);
    //     }
    //   );
    // } catch (error) {
    //   console.log('error', error);
    // }

    try {
      const track = await spotifyApi.searchTracks(searchTerm, {});
      console.log(track.body.tracks)
    } catch (error) {
      console.error(error)
    }
  }

  firstTest();
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


// firstTest();
// convertToBase64(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
// getToken();
main();