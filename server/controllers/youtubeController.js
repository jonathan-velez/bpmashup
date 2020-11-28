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

// return the best YouTube search result for a given query.
// optionally take in the duration of the requested track in milliseconds
// to be used when trying to determine best match
// returns ID by default, but optionally returns the full result object
const getBestYouTubeSearchResult = async (
  searchString,
  targetDuration,
  fullObject = false,
) => {
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
        // we need to call a 2nd endpoint to get video data

        // contruct the get params for each video ID
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
          { id: null, diff: Number.MAX_SAFE_INTEGER, idx: -1 },
        );

        console.log('closestDurationVideo', closestDurationVideo);

        if (closestDurationVideo.id) {
          videoId = closestDurationVideo.id;
        }
      }

      if (fullObject) {
        const target = items.filter(
          (item) => item.id && item.id.videoId === videoId,
        );
        return target.length > 0 ? target[0] : {};
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
      const ytId = await getBestYouTubeSearchResult(query, lengthMs);

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

const searchv2 = async (req, res) => {
  const { query } = req;
  const { q, lengthMs } = query;

  const ytObject = await getBestYouTubeSearchResult(q, lengthMs, true);
  console.log('ytObject', ytObject);

  res.json({
    success: true,
    data: ytObject,
  });
};

exports.getBestYouTubeSearchResult = getBestYouTubeSearchResult;
exports.downloadYTAsMp3 = downloadYTAsMp3;
exports.getYouTubeLink = getYouTubeLink;
exports.searchv2 = searchv2;
