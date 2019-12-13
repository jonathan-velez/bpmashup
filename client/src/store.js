import { createStore, applyMiddleware, compose } from 'redux';
import ReduxPromise from 'redux-promise';
import { syncHistoryWithStore } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';
import logger from 'redux-logger'

import rootReducer from './reducers/index';
import { getStorage, setStorage } from './localStorage';
import { activityLogger, checkProtectedAction } from './middleware';

const persistedStorage = getStorage('state');

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const createStoreWithFirebase = composeEnhancers(
  // reactReduxFirebase(firebase, rrfConfig),
  applyMiddleware(ReduxPromise, thunk, logger, activityLogger, checkProtectedAction)
)(createStore);

const store = createStoreWithFirebase(rootReducer, persistedStorage);

store.subscribe(() => {
  const state = store.getState();
  setStorage('state', {
    mediaPlayer: state.mediaPlayer,
  });
});

export const history = syncHistoryWithStore(createBrowserHistory(), store);

export default store;
