import { createStore, applyMiddleware, compose } from 'redux';
import ReduxPromise from 'redux-promise';
import { syncHistoryWithStore } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import { reactReduxFirebase } from 'react-redux-firebase';
import firebase from 'firebase';
import thunk from 'redux-thunk';
import logger from 'redux-logger'

import rootReducer from './reducers/index';
import { loadStorage, setStorage } from './localStorage';
import { activityLogger } from './middleware';
import { LOAD_PLAYLISTS } from './constants/actionTypes';

const persistedStorage = loadStorage();

const firebaseConfig = {
  apiKey: "AIzaSyB64LWcBgz5xhtwii5LQDRlfBFivZk6GOU",
  authDomain: "bp-mashup.firebaseapp.com",
  databaseURL: "https://bp-mashup.firebaseio.com",
  projectId: "bp-mashup",
  storageBucket: "",
  messagingSenderId: "683438091005"
};

const rrfConfig = {
  userProfile: 'users',
  attachAuthIsReady: true,
  firebaseStateName: 'firebaseState',
}

firebase.initializeApp(firebaseConfig);

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig),
  applyMiddleware(ReduxPromise, thunk, logger, activityLogger)
)(createStore);

const store = createStoreWithFirebase(rootReducer, persistedStorage);

store.subscribe(() => {
  const state = store.getState();
  setStorage(state);
});

store.firebaseAuthIsReady.then((user) => {
  const { uid } = store.getState().firebaseState.auth;
  const db = firebase.database();
  const playlistListRef = db.ref(`users/${uid}/playlists`);

  playlistListRef.on('value', snapshot => {
    const playlistList = snapshot.val();
    if (playlistList) {
      store.dispatch({
        type: LOAD_PLAYLISTS,
        payload: playlistList,
      });
    }
  });
})

export const history = syncHistoryWithStore(createBrowserHistory(), store);

export default store;
