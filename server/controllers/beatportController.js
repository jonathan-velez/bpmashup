const OAuth = require('oauth').OAuth;
const _ = require('lodash');

const bpAPIConfig = require('../config/api');
const bpAPIModels = require('../config/models');
const utils = require('../utils');
const constants = require('../config/constants');
const lastFmController = require('../controllers/lastFmController');

const ACCESS_TOKEN = process.env.BP_ACCESS_TOKEN;
const ACCESS_TOKEN_SECRET = process.env.BP_ACCESS_TOKEN_SECRET;
const CONSUMER_KEY = process.env.BP_CONSUMER_KEY;
const SECRET_KEY = process.env.BP_SECRET;
const BASE_URL = constants.BP_BASE_URL;

const oa = new OAuth(BASE_URL, BASE_URL, CONSUMER_KEY, SECRET_KEY, '1.0A', undefined, 'HMAC-SHA1');

const executeOA = (reqPath, reqQuery) => {
  return new Promise((resolve, reject) => {
    const urlStr = utils.urlBuilder(reqPath, reqQuery);
    if (!urlStr) {
      reject('invalid url');
      return;
    }

    //call API with our completed URL
    oa.get(BASE_URL + urlStr, ACCESS_TOKEN, ACCESS_TOKEN_SECRET, (error, data) => {
      if (!data) {
        reject(error);
        return;
      }

      const returnData = JSON.parse(data);

      if (error || returnData.metadata.error) {
        console.log(`Error calling '${urlStr}': `, returnData.metadata.error)
        reject(error);
        return;
      }

      resolve(returnData);
    });
  });
}

async function callApi(req, res) {
  const reqPath = utils.filterPath(req.url);
  const reqQuery = req.query;
  let jsonResponse = {};

  try {
    const model = bpAPIConfig[reqPath].model;
    const bpData = await executeOA(reqPath, reqQuery);

    // remove properties that aren't in our model
    if (model) {
      for (let key in bpData.results) {
        if (bpData.results.hasOwnProperty(key)) {
          Object.getOwnPropertyNames(bpData.results[key]).forEach((val, idx, array) => {
            if (model.indexOf(val) === -1) delete bpData.results[key][val];
          });
        }
      }
    }

    res.json(Object.assign({}, jsonResponse, bpData));
  } catch (ex) {
    console.log('BP API error: ', ex);
    res.json(jsonResponse);
  }
}

// Get artist details from Beatport. If no biography is found, hit up Last.fm's API and patch the bio into the BP response object
async function getArtistData(req, res) {
  const { query } = req;
  let detail = await executeOA('artists/detail', { id: query.id });
  let { results } = detail;
  let jsonResponse = {};

  if (results) {
    const { biography, name } = results;
    if (!biography) {
      console.log('No bio in beatport, call last-fm API', name);
      const lastFmArtistData = await lastFmController.callGetArtistInfo(name);
      const { bio } = lastFmArtistData;

      if (bio) {
        let { content: biography } = bio;
        // remove last.fm link
        biography = biography.substr(0, biography.indexOf('<a href=\"https://www.last.fm'));

        Object.assign(jsonResponse, {
          ...detail,
          results: {
            ...results,
            biography
          }
        })
      }
    }
  }
  res.json(jsonResponse);
}

exports.callApi = callApi;
exports.getArtistData = getArtistData;
