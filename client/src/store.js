import { createStore, applyMiddleware, compose } from 'redux';
import ReduxPromise from 'redux-promise';
import { syncHistoryWithStore } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import { reactReduxFirebase } from 'react-redux-firebase';
import firebase from 'firebase';
import thunk from 'redux-thunk';
import logger from 'redux-logger'
import _ from 'lodash';

import rootReducer from './reducers/index';
import { loadStorage, setStorage } from './localStorage';
import { activityLogger } from './middleware';
import { LOAD_PLAYLISTS, LOAD_DOWNLOADED_TRACKS, LOAD_LOVED_TRACKS, LOAD_LOVED_ARTISTS, LOAD_LOVED_LABELS } from './constants/actionTypes';

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
  setStorage({
    mediaPlayer: state.mediaPlayer,
  });
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

  // load downloaded tracks into Redux
  const downloadsRef = db.ref(`users/${uid}/downloads`);
  downloadsRef.once('value').then(snapshot => {
    const downloads = snapshot.val();

    if (downloads) {
      store.dispatch({
        type: LOAD_DOWNLOADED_TRACKS,
        payload: Object.keys(downloads).map(Number),
      });
    }
  });

  // load loved tracks into Redux, filter out previously loved tracks
  const lovedTracksRef = db.ref(`users/${uid}/lovedTracks`);
  lovedTracksRef.once('value').then(snapshot => {
    const lovedTracksObject = snapshot.val();

    if (lovedTracksObject) {
      const lovedTracks = _.pickBy(lovedTracksObject, (obj) => obj === 1);

      store.dispatch({
        type: LOAD_LOVED_TRACKS,
        payload: Object.keys(lovedTracks).map(Number),
      })
    }
  })

  // load loved artists into Redux, filter out previously loved artists
  const lovedArtistsRef = db.ref(`users/${uid}/lovedArtists`);
  lovedArtistsRef.once('value').then(snapshot => {
    const lovedArtistsObject = snapshot.val();

    if (lovedArtistsObject) {
      const lovedArtists = _.pickBy(lovedArtistsObject, (obj) => obj === 1);

      store.dispatch({
        type: LOAD_LOVED_ARTISTS,
        payload: Object.keys(lovedArtists).map(Number),
      })
    }
  })

  // load loved labels into Redux, filter out previously loved labels
  const lovedLabelsRef = db.ref(`users/${uid}/lovedLabels`);
  lovedLabelsRef.once('value').then(snapshot => {
    const lovedLabelsObject = snapshot.val();

    if (lovedLabelsObject) {
      const lovedLabels = _.pickBy(lovedLabelsObject, (obj) => obj === 1);

      store.dispatch({
        type: LOAD_LOVED_LABELS,
        payload: Object.keys(lovedLabels).map(Number),
      })
    }
  })

})

export const history = syncHistoryWithStore(createBrowserHistory(), store);

export default store;
