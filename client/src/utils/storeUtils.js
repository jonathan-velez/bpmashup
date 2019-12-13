import firebase from 'firebase';
import _ from 'lodash';

import store from '../store';
import { LOAD_PLAYLISTS, LOAD_DOWNLOADED_TRACKS, LOAD_LOVED_TRACKS, LOAD_LOVED_ARTISTS, LOAD_LOVED_LABELS, LOAD_PERMS, LOAD_NO_DOWNLOADS_TRACKS } from '../constants/actionTypes';

export const registerFirebaseListeners = () => {
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
  const downloadsRef = db.ref(`downloads/users/${uid}/trackIds`);
  downloadsRef.on('value', snapshot => {
    const downloads = snapshot.val();

    if (downloads) {
      store.dispatch({
        type: LOAD_DOWNLOADED_TRACKS,
        payload: Object.values(downloads).map(Number),
      });
    }
  });

  // load missing downloads into Redux
  const noDownloadssRef = db.ref(`noDownloads/users/${uid}/trackIds`);
  noDownloadssRef.on('value', snapshot => {
    const noDownloads = snapshot.val();

    if (noDownloads) {
      store.dispatch({
        type: LOAD_NO_DOWNLOADS_TRACKS,
        payload: Object.values(noDownloads).map(Number),
      })
    }
  })

  // load loved tracks into Redux, filter out previously loved tracks
  const lovedTracksRef = db.ref(`users/${uid}/lovedTracks`);
  lovedTracksRef.on('value', snapshot => {
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
  lovedArtistsRef.on('value', snapshot => {
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
  lovedLabelsRef.on('value', snapshot => {
    const lovedLabelsObject = snapshot.val();

    if (lovedLabelsObject) {
      const lovedLabels = _.pickBy(lovedLabelsObject, (obj) => obj === 1);

      store.dispatch({
        type: LOAD_LOVED_LABELS,
        payload: Object.keys(lovedLabels).map(Number),
      })
    }
  })

  // load permissions
  const permsRef = db.ref(`users/${uid}/permissions`);
  permsRef.once('value').then((snapshot) => {
    const perms = snapshot.val();
    if (perms) {
      const payload = Object.keys(perms).filter(perm => perms[perm] === 1);

      store.dispatch({
        type: LOAD_PERMS,
        payload,
      })
    }
  })
}