export const getStorage = (key) => {
  try {
    const payload = sessionStorage.getItem(key);

    if (payload === null) {
      return undefined;
    }

    // parse payload as JSON if pulling state for store load
    return key === 'state' ? JSON.parse(payload) : payload;
  } catch (err) {
    return undefined;
  }
};

export const setStorage = (key, value) => {
  try {
    const serializedValue = key === 'state' ? JSON.stringify(value) : value;

    sessionStorage.setItem(key, serializedValue);
  } catch (err) {
    console.log('error with setState', err, value);
  }
};
