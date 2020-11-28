const path = require('path');
const axios = require('axios');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

const ytKey = process.env.YOUTUBE_API_KEY;
const ytURL =
  'https://www.googleapis.com/youtube/v3/search?type=video&safeSearch=none&videoEmbeddable=true&videoSyndicated=true&part=snippet&videoDuration=medium&q=';

// TODO: give this a better name
exports.Youtube = async (req, res) => {
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
};

const getYTId = async (searchString) => {
  const searchURL = `${ytURL}${encodeURIComponent(searchString)}&key=${ytKey}`;

  try {
    const ytResponse = await axios.get(searchURL);
    if (ytResponse.status === 200 && ytResponse.data) {
      const { items = [] } = ytResponse.data;
      const firstResult = items[0] || {};
      const { id = {} } = firstResult;
      const { videoId } = id;

      return videoId;
    }

    return null;
  } catch (error) {
    console.log(`Error in YouTube Controller: ${error}`);
    return null;
  }
};

const downloadYTAsMp3 = async (id, fileName) => {
  return new Promise((resolve, reject) => {
    let thePath = path.resolve(__dirname, '../downloads', fileName + '.mp3');

    const stream = ytdl(id, {
      quality: 'highestaudio',
    });

    const start = Date.now();
    try {
      ffmpeg(stream)
        .audioBitrate(320)
        .save(thePath)
        .on('progress', (p) => {
          console.log(`${p.targetSize}kb downloaded`);
        })
        .on('end', () => {
          console.log(
            `\nDownload complete: ${fileName} - ${
              (Date.now() - start) / 1000
            }s`,
          );

          return resolve({
            href: `/api/download-it/?fileName=${encodeURIComponent(
              fileName + '.mp3',
            )}`,
            fileName,
            success: true,
          });
        });
    } catch (error) {
      return reject({
        success: false,
        error,
      });
    }
  });
};

const getYouTubeLink = (query) => {
  return new Promise(async (resolve) => {
    try {
      console.log('getYT Link query', query);
      const ytId = await getYTId(query);

      const res = await downloadYTAsMp3(ytId, `${query} - [YT-320] - ${ytId}`);
      return resolve(res);
    } catch (error) {
      return resolve({
        href: null,
        success: false,
        error: 'No file found - ' + error,
      });
    }
  });
};

exports.getYTId = getYTId;
exports.downloadYTAsMp3 = downloadYTAsMp3;
exports.getYouTubeLink = getYouTubeLink;
