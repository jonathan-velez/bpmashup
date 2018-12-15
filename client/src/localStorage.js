export const loadStorage = () => {
  try {
    const serializedState = sessionStorage.getItem('state');

    if (serializedState === null) {
      return undefined;
    }

    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const setStorage = state => {
  try {
    const serializedState = JSON.stringify(state);

    sessionStorage.setItem('state', serializedState);
  } catch (err) {
    console.log('error with setState', err, state);
  }
};