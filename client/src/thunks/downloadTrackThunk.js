import firebase from 'firebase';
import moment from 'moment';

import { DOWNLOAD_TRACK, ADD_TRACK_TO_NO_DOWNLOAD_LIST } from '../constants/actionTypes';

const setFirebase = (state, track, type) => {
  const { id: trackId } = track;
  const { uid } = state.firebaseState.auth;
  if (!uid || uid === 0) return;

  const db = firebase.database();

  if (type === 'addDownload') {
    const downloadsRef = db.ref(`users/${uid}/downloads/${trackId}`);

    downloadsRef.transaction(currentValue => {
      return (currentValue || 0) + 1;
    })
  } else if (type === 'addNoDownload') {
    const noDownloadssRef = db.ref(`noDownloads/users/${uid}/trackIds/${track.id}`);
    noDownloadssRef.transaction(currentValue => {
      return (currentValue || 0) + 1;
    });

    const noDownloadsTotalRef = db.ref(`noDownloads/trackCount`);
    noDownloadsTotalRef.transaction(currentValue => {
      return (currentValue || 0) + 1;
    })

    firebase.set(`noDownloads/users/${uid}/tracks/${trackId}`, {
      track,
      timeStamp: moment().format(),
      downloaded: false,
    });
  }
}

export const downloadTrack = payload => {
  return (dispatch, getState) => {
    dispatch({
      type: DOWNLOAD_TRACK,
      payload
    })

    setFirebase(getState(), payload, 'addDownload');
  }
}

export const addTrackToNoDownloadList = payload => {
  return (dispatch, getState) => {
    dispatch({
      type: ADD_TRACK_TO_NO_DOWNLOAD_LIST,
      payload
    })

    setFirebase(getState(), payload, 'addNoDownload');
  }
}
