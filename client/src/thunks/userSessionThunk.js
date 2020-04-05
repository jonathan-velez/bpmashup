import firebase from 'firebase';
import _ from 'lodash';

import {
  LOAD_PLAYLISTS,
  LOAD_NO_DOWNLOADS_TRACKS,
  LOAD_LOVED_TRACKS,
  LOAD_LOVED_ARTISTS,
  LOAD_LOVED_LABELS,
  LOAD_PERMS,
} from '../constants/actionTypes';

export const loadPlaylists = userId => {
  return (dispatch, getState) => {
    let uid = null;
    if (userId) {
      uid = userId;
    } else {
      uid = getState().firebaseState.auth.uid
    }
    const db = firebase.database();
    const playlistListRef = db.ref(`users/${uid}/playlists`);

    playlistListRef.once('value', snapshot => {
      const playlistList = snapshot.val();
      if (playlistList) {
        dispatch({
          type: LOAD_PLAYLISTS,
          payload: playlistList,
        });
      }
    });
  }
}

export const loadNoDownloads = userId => {
  return (dispatch, getState) => {
    let uid = null;
    if (userId) {
      uid = userId;
    } else {
      uid = getState().firebaseState.auth.uid
    }
    const db = firebase.database();
    const noDownloadssRef = db.ref(`noDownloads/users/${uid}/trackIds`);

    noDownloadssRef.once('value', snapshot => {
      const noDownloads = snapshot.val();
      if (noDownloads) {
        dispatch({
          type: LOAD_NO_DOWNLOADS_TRACKS,
          payload: Object.values(noDownloads).map(Number),
        });
      }
    });
  }
}

export const loadLovedTracks = userId => {
  return (dispatch, getState) => {
    let uid = null;
    if (userId) {
      uid = userId;
    } else {
      uid = getState().firebaseState.auth.uid
    }
    const db = firebase.database();
    const lovedTracksRef = db.ref(`users/${uid}/lovedTracks`);

    lovedTracksRef.once('value', snapshot => {
      const lovedTracksObject = snapshot.val();
      if (lovedTracksObject) {
        const lovedTracks = _.pickBy(lovedTracksObject, (obj) => obj === 1);
        dispatch({
          type: LOAD_LOVED_TRACKS,
          payload: Object.keys(lovedTracks).map(Number),
        });
      }
    });
  }
}

export const loadLovedArtists = userId => {
  return (dispatch, getState) => {
    let uid = null;
    if (userId) {
      uid = userId;
    } else {
      uid = getState().firebaseState.auth.uid
    }
    const db = firebase.database();
    const lovedArtistsRef = db.ref(`users/${uid}/lovedArtists`);

    lovedArtistsRef.once('value', snapshot => {
      const lovedArtistsObject = snapshot.val();
      if (lovedArtistsObject) {
        const lovedArtists = _.pickBy(lovedArtistsObject, (obj) => obj === 1);
        dispatch({
          type: LOAD_LOVED_ARTISTS,
          payload: Object.keys(lovedArtists).map(Number),
        });
      }
    });
  }
}

export const loadLovedLabels = userId => {
  return (dispatch, getState) => {
    let uid = null;
    if (userId) {
      uid = userId;
    } else {
      uid = getState().firebaseState.auth.uid
    }
    const db = firebase.database();
    const lovedLabelsRef = db.ref(`users/${uid}/lovedLabels`);

    lovedLabelsRef.once('value', snapshot => {
      const lovedLabelsObject = snapshot.val();
      if (lovedLabelsObject) {
        const lovedLabels = _.pickBy(lovedLabelsObject, (obj) => obj === 1);
        dispatch({
          type: LOAD_LOVED_LABELS,
          payload: Object.keys(lovedLabels).map(Number),
        });
      }
    });
  }
}

export const loadPermissions = userId => {
  return (dispatch, getState) => {
    let uid = null;
    if (userId) {
      uid = userId;
    } else {
      uid = getState().firebaseState.auth.uid;
    }
    const db = firebase.database();
    const permsRef = db.ref(`users/${uid}/permissions`);

    permsRef.once('value', snapshot => {
      const perms = snapshot.val();

      if (perms) {
        const payload = Object.keys(perms).filter(perm => perms[perm] === 1);
        dispatch({
          type: LOAD_PERMS,
          payload: Object.values(payload).map(Number),
        });
      }
    });
  }
}
