const OAuth = require('oauth').OAuth;
const axios = require('axios');
const cheerio = require('cheerio');

const utils = require('../utils');
const constants = require('../config/constants');
const lastFmController = require('../controllers/lastFmController');

const ACCESS_TOKEN = process.env.BP_ACCESS_TOKEN;
const ACCESS_TOKEN_SECRET = process.env.BP_ACCESS_TOKEN_SECRET;
const CONSUMER_KEY = process.env.BP_CONSUMER_KEY;
const SECRET_KEY = process.env.BP_SECRET;
const BASE_URL = constants.BP_BASE_URL;

const oa = new OAuth(
  BASE_URL,
  BASE_URL,
  CONSUMER_KEY,
  SECRET_KEY,
  '1.0A',
  undefined,
  'HMAC-SHA1',
);

const executeOA = (reqPath, reqQuery) => {
  return new Promise((resolve, reject) => {
    const urlStr = utils.urlBuilder(reqPath, reqQuery);
    if (!urlStr) {
      reject('invalid url');
      return;
    }

    //call API with our completed URL
    oa.get(
      BASE_URL + urlStr,
      ACCESS_TOKEN,
      ACCESS_TOKEN_SECRET,
      (error, data) => {
        if (!data) {
          reject(error);
          return;
        }

        let returnData;

        try {
          returnData = JSON.parse(data);
        } catch (error) {
          console.log('Error parsing response data: ', data, error);
          return reject(error);
        }

        if (error || returnData.metadata.error) {
          console.log(`Error calling '${urlStr}': `, returnData.metadata.error);
          return reject(error);
        }

        resolve(returnData);
      },
    );
  });
};

async function callApi(req, res) {
  const reqPath = utils.filterPath(req.url);
  const reqQuery = utils.constructRequestQueryString(req.query);
  console.log('req.query', req.query);
  console.log('reqQuery', reqQuery);
  const bpUrl = utils.urlBuilderNew(reqPath, reqQuery);

  try {
    console.log('calling bp url', bpUrl);
    const result = await axios.get(bpUrl);
    const { data, status } = result;

    if (status !== 200) {
      return res.json({});
    }

    return res.json(data);
  } catch (ex) {
    console.log('BP API error: ', ex);
    res.json({});
  }
}

async function _scrapeBeatportPage(url, type) {
  return new Promise(async (resolve) => {
    let targetElement = '';
    let biography = '';

    if (type === 'label') {
      targetElement = '.interior-expandable';
    }

    try {
      if (targetElement) {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        biography = $(targetElement).text();
      }
    } catch (error) {
      console.log('Error scraping beatport', error);
    } finally {
      resolve(biography);
    }
  });
}

async function getLabelData(req, res) {
  const reqQuery = utils.constructRequestQueryString(req.query);
  const labelResults = await executeOA('labels', reqQuery);

  try {
    const { results } = labelResults;
    console.log('labelResults count', labelResults.results.length);

    // when fetching a single Label, we want to make sure there's a biography
    if (results && Array.isArray && results.length === 1) {
      let labelData = results[0];

      if (labelData.biography === '') {
        // no bio from beatport API, scrape their site instead
        try {
          labelData.biography = await _scrapeBeatportPage(
            `https://www.beatport.com/label/${req.query.name}/${req.query.id}`,
            'label',
          );
        } catch (error) {
          console.log('Error scraping beatport for label bio', error);
        }
      }

      res.json({
        ...labelResults,
        results: [labelData],
      });
    }
  } catch (error) {
    console.log('Error fetching label data', error);
    res.json({});
  }

  res.json(labelResults);
}

// Get artist details from Beatport. If no biography is found, hit up Last.fm's API and patch the bio into the BP response object
const getArtistData = async (req, res) => {
  const { id: artistId } = req.query;

  // fetch base level artist data:
  // bio, image.uri, name, slug, dj_association
  // e.g. https://www.beatport.com/api/v4/catalog/artists/98876

  const artistUrl = `${BASE_URL}artists/${artistId}`;
  const artistResult = await axios.get(artistUrl);
  let { data: artistData } = artistResult;

  if (artistResult.status !== 200) {
    return res.status(artistResult.status).json({
      success: false,
      //...
    });
  }

  // fetch bio from last.fm if bp doesn't have it
  if (!artistData.bio) {
    console.log('No bio in beatport, call last-fm API', artistData.name);
    const lastFmArtistData = await lastFmController.callGetArtistInfo(
      artistData.name,
    );
    const { bio } = lastFmArtistData;

    if (bio) {
      let { content: biography } = bio;
      // remove last.fm link
      biography = biography.substr(
        0,
        biography.indexOf('<a href="https://www.last.fm'),
      );

      artistData = {
        ...artistData,
        bio: biography,
      };
    }
  }

  // fetch artist charts by their dj id
  // e.g. https://www.beatport.com/api/v4/catalog/charts?dj_id=25496
  const { dj_association } = artistData;
  let artistChartsData = {};
  if (dj_association) {
    const artistChartsUrl = `${BASE_URL}charts?dj_id=${dj_association}&per_page=36`;
    const artistChartsResult = await axios.get(artistChartsUrl);
    artistChartsData = artistChartsResult.data;
  }

  // fetch latest artist releases by their artist id
  // e.g. https://www.beatport.com/api/v4/catalog/releases?artist_id=25496&order_by=-release_date
  // Note: prepend the order_by value with a "-" for descending order
  const { id: artist_id } = artistData;
  const artistReleasesUrl = `${BASE_URL}releases?artist_id=${artist_id}&order_by=-release_date`;
  const artistReleasesResult = await axios.get(artistReleasesUrl);
  const { data: artistReleasesData } = artistReleasesResult;

  res.status(200).json({
    success: true,
    data: {
      ...artistData,
      charts: artistChartsData.results,
      featuredReleases: artistReleasesData.results,
    },
  });
};

// beatport API v4 /tracks/similar is blocked, but they have tracks/{id}/beatbot available
// which pulls in Recommended Tracks, which may very well be the same data anyway
const fetchBeatbotTracks = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(500).json({
      success: false,
      message: 'No track ID specified',
    });
  }

  const beatbotUrl = `${BASE_URL}tracks/${id}/beatbot`;
  const beatbotResult = await axios.get(beatbotUrl);
  const { data } = beatbotResult;

  res.status(200).json(data);
};

const fetchTopGenreTracks = async (req, res) => {
  try {
    const { genreId, numOfTracks = 100 } = req.params;

    const topTracksUrl = `${BASE_URL}genres/${genreId}/top/${numOfTracks}`;
    const topTracksResult = await axios.get(topTracksUrl);
    const { data } = topTracksResult;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.callApi = callApi;
exports.getArtistData = getArtistData;
exports.getLabelData = getLabelData;
exports.fetchBeatbotTracks = fetchBeatbotTracks;
exports.fetchTopGenreTracks = fetchTopGenreTracks;
