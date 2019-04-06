const axios = require('axios');

exports.Youtube = async (req, res) => {
  const ytKey = process.env.YOUTUBE_API_KEY;
  const ytURL = 'https://www.googleapis.com/youtube/v3/search?type=video&safeSearch=none&videoEmbeddable=true&videoSyndicated=true&part=snippet&videoDuration=medium&q='

  const searchURL = `${ytURL}${encodeURIComponent(req.query.q)}&key=${ytKey}`;

  console.log('Searching Youtube: ', searchURL);

  const body = [];
  try {
    const ytResponse = await axios.get(searchURL);
    
    if (ytResponse.status === 200 && ytResponse.data) {
      body.push(ytResponse.data.items[0]);
      console.log('Youtube result', body);
    }
  } catch (error) {
    console.log(`Error in YouTube Controller: ${error}`);
  }

  res.json(body);
}
