export const getStorage = (key) => {
  try {
    const payload = sessionStorage.getItem(key);

    if (payload === null) {
      return undefined;
    }

    // parse payload if pulling state or preferences (serialized JSON)
    return key === 'state' || key === 'preferences'
      ? JSON.parse(payload)
      : payload;
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
