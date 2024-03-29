import firebase from 'firebase';
import { v4 } from 'node-uuid';

import store from '../store';
import {
  LOAD_PLAYLISTS,
  LOAD_LOVED_TRACKS,
  LOAD_LOVED_ARTISTS,
  LOAD_LOVED_LABELS,
  LOAD_PERMS,
  UPDATE_DOWNLOAD_QUEUE,
  LOAD_PREFERENCES,
  LOAD_LOVED_CHARTS,
} from '../constants/actionTypes';

import {
  setActionMessage,
  removeActionMessage,
} from '../actions/ActionCreators';

export const registerFirebaseListeners = () => {
  return new Promise(async (resolve) => {
    const { uid } = store.getState().firebaseState.auth;
    if (!uid) return;

    const listeners = [];
    const firestore = firebase.firestore();
    const userRef = firestore.collection(`users`).doc(uid);

    // load permissions
    const userDocs = await userRef.get();
    if (userDocs.exists) {
      const { permissions } = userDocs.data();

      store.dispatch({
        type: LOAD_PERMS,
        payload: permissions,
      });
    }

    // listen to playlists
    const playlistsRef = userRef
      .collection('playlists')
      .where('active', '==', true);
    playlistsRef.onSnapshot((playlists) => {
      let payload = {};

      playlists.forEach(async (item) => {
        const playlist = item.data();

        payload[item.id] = {
          ...playlist,
          id: item.id,
        };
      });

      store.dispatch({
        type: LOAD_PLAYLISTS,
        payload,
      });
    });

    // listen to loved labels
    const lovedLabels = userRef
      .collection('loves')
      .doc('labels')
      .onSnapshot((lovedLabels) => {
        let payload = {};
        if (lovedLabels.exists) {
          payload = lovedLabels.data();
        }

        store.dispatch({
          type: LOAD_LOVED_LABELS,
          payload,
        });
      });

    listeners.push(lovedLabels);

    // listen to loved artists
    const lovedArtists = userRef
      .collection('loves')
      .doc('artists')
      .onSnapshot((lovedArtists) => {
        let payload = {};
        if (lovedArtists.exists) {
          payload = lovedArtists.data();
        }

        // dispatch redux
        store.dispatch({
          type: LOAD_LOVED_ARTISTS,
          payload,
        });
      });

    listeners.push(lovedArtists);

    // listen to loved tracks
    const lovedTracks = userRef
      .collection('loves')
      .doc('tracks')
      .onSnapshot((lovedTracks) => {
        let payload = {};
        if (lovedTracks.exists) {
          payload = lovedTracks.data();
        }

        // dispatch redux
        store.dispatch({
          type: LOAD_LOVED_TRACKS,
          payload,
        });
      });

    listeners.push(lovedTracks);

    // listen to loved charts
    const lovedCharts = userRef
      .collection('loves')
      .doc('charts')
      .onSnapshot((lovedCharts) => {
        let payload = {};
        if (lovedCharts.exists) {
          payload = lovedCharts.data();
        }

        // dispatch redux
        store.dispatch({
          type: LOAD_LOVED_CHARTS,
          payload,
        });
      });

    listeners.push(lovedCharts);

    // listen to download queue
    const downloadQueueRefFirestore = firestore
      .collection(`users/${uid}/downloadQueue`)
      .orderBy('addedDate', 'desc');
    const downloadQueue = downloadQueueRefFirestore.onSnapshot((downloads) => {
      const downloadQueueUser = {};
      downloads.forEach((snapshot) => {
        const snapshotData = snapshot.data();

        const queueItem = {
          id: snapshot.id,
          ...snapshotData,
        };

        // filter out purged
        if(!snapshotData.purged){
          downloadQueueUser[snapshot.id] = queueItem;
        }
      });

      store.dispatch({
        type: UPDATE_DOWNLOAD_QUEUE,
        payload: downloadQueueUser,
      });
    });

    listeners.push(downloadQueue);

    // listen to user preferences
    const userPreferencesRef = firestore.collection(`users/${uid}/preferences`);
    const userPreferences = userPreferencesRef.onSnapshot((preferences) => {
      let userPreferences = {};
      preferences.forEach((snapshot) => {
        userPreferences = {
          ...userPreferences,
          ...snapshot.data(),
        };

        store.dispatch({
          type: LOAD_PREFERENCES,
          payload: userPreferences,
        });
      });
    });

    listeners.push(userPreferences);

    return resolve(listeners);
  });
};

export const generateActivityMessage = (message, messageType = 'positive') => {
  const id = v4();
  store.dispatch(
    setActionMessage({
      id,
      message,
      messageType,
    }),
  );
  setTimeout(() => {
    store.dispatch(removeActionMessage(id));
  }, 3000);
};

// TODO: DRY up ref to user object
