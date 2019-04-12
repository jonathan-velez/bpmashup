import moment from 'moment';
import axios from 'axios';

const setStorage = (path, payload) => {
  const stamp = moment().format();

  const serializedPayload = JSON.stringify(Object.assign(payload, { stamp }));
  sessionStorage.setItem(path, serializedPayload);
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
  const isStillAlive = cachedResult && moment(cachedResult.stamp).add(1, 'hour').isAfter(moment().format()); // set it to 1 hr for now
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
      resolve(requestResult);
      return;
    } catch (error) {
      reject(error);
    }
  })
}
