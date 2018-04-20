const request = require('request');

exports.Youtube = (req, res) => {
  const ytKey = process.env.YOUTUBE_API_KEY;
  const ytURL = 'https://www.googleapis.com/youtube/v3/search?type=video&safeSearch=none&videoEmbeddable=true&videoSyndicated=true&part=snippet&videoDuration=medium&q='

  const searchURL = `${ytURL}${req.query.q}&key=${ytKey}`;

  console.log('Searching Youtube: ', searchURL);

  request(searchURL, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      body = JSON.parse(body).items;
      console.log('Video ID: ', body[0].id.videoId);
    }
    res.json(body);
  })
}
