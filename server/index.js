const dotenv = require('dotenv');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

dotenv.load({ path: '.env' });

const staticFiles = express.static(path.join(__dirname, '../client/build'));
app.use(staticFiles);

const bpController = require('./controllers/beatportController');
const zippyController = require('./controllers/zippyController');
const ytController = require('./controllers/youtubeController');

app.use(`${process.env.API_BASE_URL}/most-popular`, (req, res, next) => {
  req.query.newValue = 'someTestValue';
  next();
});

app.get(`${process.env.API_BASE_URL}/genres`, bpController.callApi);
app.get(`${process.env.API_BASE_URL}/search`, bpController.callApi);
app.get(`${process.env.API_BASE_URL}/most-popular`, bpController.callApi);
app.get(`${process.env.API_BASE_URL}/most-popular/:type`, bpController.callApi);
app.get(`${process.env.API_BASE_URL}/autocomplete`, bpController.callApi);
app.get(`${process.env.API_BASE_URL}/artists/detail`, bpController.callApi);
app.get(`${process.env.API_BASE_URL}/tracks/similar`, bpController.callApi);
app.get(`${process.env.API_BASE_URL}/download-track`, zippyController.zippyScrape);
app.get(`${process.env.API_BASE_URL}/youtube/search`, ytController.Youtube);

app.use('/*', staticFiles);

app.set('port', (process.env.PORT || 3001)); 
app.listen(app.get('port'), () => {
  console.log('process.env.PORT', process.env.PORT)
  console.log(`Listening on ${app.get('port')}`);
});
