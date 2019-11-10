import moment from 'moment';
import axios from 'axios';

const setStorage = (path, payload) => {
  const stamp = Date.now();
  const serializedPayload = JSON.stringify(Object.assign(payload, { stamp }));

  try {
    sessionStorage.setItem(path, serializedPayload);
  } catch (error) {
    makeRoomForStorageAndRetry(path, payload);
  }
}

const removeItemFromStorageByKey = (key) => {
  sessionStorage.removeItem(key);
}

const makeRoomForStorageAndRetry = (path, payload) => {
  // call this function when caching fails due to sessionStorage exceeding its limit
  // remove the oldest cached item and try to store payload, repeat until successful

  const sortedItemKeys = Object.keys(sessionStorage).sort((a, b) => (JSON.parse(sessionStorage[a]).stamp) - (JSON.parse(sessionStorage[b]).stamp));
  removeItemFromStorageByKey(sortedItemKeys[0]);
  setStorage(path, payload);
}

const getStorage = path => {
  try {
    const serializedPayload = sessionStorage.getItem(path);
    if (serializedPayload === null) {
      return undefined;
    }

    return JSON.parse(serializedPayload);
  } catch (err) {
    return undefined;
  }
};

const getCachedResult = path => {
  const cachedResult = getStorage(path);
  const isStillAlive = cachedResult && moment(cachedResult.stamp).add(1, 'hour').isAfter(moment());
  return (cachedResult && isStillAlive) ? cachedResult : undefined;
}

export const callAPIorCache = path => {
  return new Promise(async (resolve, reject) => {
    try {
      let requestResult = getCachedResult(path);
      if (!requestResult || (requestResult && Object.keys(requestResult.data).length === 0 && requestResult.constructor === Object)) {
        requestResult = await axios.get(path);
        if (requestResult.status === 200 && Object.keys(requestResult.data).length > 0 && requestResult.constructor === Object) {
          setStorage(path, requestResult);
        }
      }
      return resolve(requestResult);
    } catch (error) {
      return reject(error);
    }
  })
}
