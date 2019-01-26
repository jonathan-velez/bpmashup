const axios = require('axios');
const { LAST_FM_API_KEY } = process.env;

// exposed api end point
async function getArtistInfo(req, res) {
  const { artistName } = req.query;
  const jsonResponse = await callGetArtistInfo(artistName);

  res.json(jsonResponse);
}

// internal method to call last.fm API, can be used in another controller
async function callGetArtistInfo(artistName) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName}&api_key=${LAST_FM_API_KEY}&format=json`;
  let jsonResponse = {};

  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(url);
      const { data } = response;
      const { artist } = data;
      
      if (artist) {
        Object.assign(jsonResponse, artist);
      }
    } catch (error) {
      console.log(`Error with callGetArtistInfo`, error);
      Object.assign(jsonResponse, { error });
      reject(jsonResponse);
      return;
    }

    resolve(jsonResponse);
  });
}

exports.callGetArtistInfo = callGetArtistInfo;
exports.getArtistInfo = getArtistInfo;
