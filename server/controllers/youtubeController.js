const path = require('path');
const axios = require('axios');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const moment = require('moment');

const ytKey = process.env.YOUTUBE_API_KEY;
const YT_API_SEARCH_URL =
  'https://www.googleapis.com/youtube/v3/search?type=video&safeSearch=none&videoEmbeddable=true&videoSyndicated=true&part=snippet&videoDuration=medium&q=';
const YT_API_VIDEOS_URL =
  'https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails';

// TODO: give this a better name
exports.Youtube = async (req, res) => {
  const searchURL = `${YT_API_SEARCH_URL}${encodeURIComponent(
    req.query.q,
  )}&key=${ytKey}`;

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

// return the best youtube ID for a given search string.
// optionally take in the duration of the requested track in milliseconds
// to be used when trying to determine best match
const getYTId = async (searchString, targetDuration) => {
  const searchURL = `${YT_API_SEARCH_URL}${encodeURIComponent(
    searchString,
  )}&key=${ytKey}`;

  try {
    const ytSearchResponse = await axios.get(searchURL);
    if (ytSearchResponse.status === 200 && ytSearchResponse.data) {
      const { items = [] } = ytSearchResponse.data;
      const firstResult = items[0] || {};
      const { id = {} } = firstResult;
      let { videoId } = id;

      // if a targetDuration was provided, let's see if we can factor it in our decision
      if (targetDuration) {
        console.log('targetDuration provided, getting video data');
        const idsString = items.reduce(
          (acc, val, idx) =>
            acc + (idx > 0 ? '&' : '') + 'id=' + val.id.videoId,
          '',
        );
  
        const videosURL = `${YT_API_VIDEOS_URL}&${idsString}&key=${ytKey}`;
        console.log('videosURL', videosURL);
        const ytVideosResponse = await axios.get(videosURL);
        const { data = {} } = ytVideosResponse;
        const { items: videoItems = [] } = data;
        console.log('videoItems', videoItems);

        // find the ID with the closest duration, either up or down
        const closestDurationVideo = videoItems.reduce(
          (acc, val, idx) => {
            const newDiff = Math.abs(
              moment
                .duration(val.contentDetails && val.contentDetails.duration)
                .asMilliseconds() - targetDuration,
            );
            return newDiff < acc.diff
              ? { id: val.id, diff: newDiff, idx }
              : acc;
          },
          { id: null, diff: 99999, idx: -1 },
        );

        console.log('closestDurationVideo', closestDurationVideo);

        if (closestDurationVideo.id) {
          videoId = closestDurationVideo.id;
        }
      }

      return videoId;
    }

    return null;
  } catch (error) {
    console.log(
      `Error in YouTube Controller: ${error} \nSearch URL: ${searchURL}`,
    );
    return null;
  }
};

const downloadYTAsMp3 = async (id, fileName) => {
  return new Promise((resolve, reject) => {
    let thePath = path.resolve(__dirname, '../downloads', fileName);

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
            href: `/api/download-it/?fileName=${encodeURIComponent(fileName)}`,
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

const getYouTubeLink = (query, lengthMs) => {
  return new Promise(async (resolve) => {
    try {
      console.log('getYT Link query', query);
      const ytId = await getYTId(query, lengthMs);

      const res = await downloadYTAsMp3(
        ytId,
        `${query} - [YT-320] - ${ytId}.mp3`,
      );
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
