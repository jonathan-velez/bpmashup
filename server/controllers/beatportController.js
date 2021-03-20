const OAuth = require('oauth').OAuth;
const axios = require('axios');
const cheerio = require('cheerio');

const bpAPIConfig = require('../config/api');
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
async function getArtistData(req, res) {
  let detail = await executeOA('artists/detail', { id: req.query.id });
  let { results } = detail;
  let jsonResponse = {};

  if (results) {
    const { biography, name } = results;
    jsonResponse = {
      ...jsonResponse,
      results,
    };

    if (!biography) {
      console.log('No bio in beatport, call last-fm API', name);
      const lastFmArtistData = await lastFmController.callGetArtistInfo(name);
      const { bio } = lastFmArtistData;

      if (bio) {
        let { content: biography } = bio;
        // remove last.fm link
        biography = biography.substr(
          0,
          biography.indexOf('<a href="https://www.last.fm'),
        );

        jsonResponse = {
          ...jsonResponse,
          ...detail,
          results: {
            ...results,
            biography,
          },
        };
      }
    }
  }
  res.json(jsonResponse);
}

exports.callApi = callApi;
exports.getArtistData = getArtistData;
exports.getLabelData = getLabelData;
