import firebase from 'firebase';

import {
  DOWNLOAD_TRACK_FROM_QUEUE,
} from '../constants/actionTypes';

export const addTrackToDownloadQueue = (track) => {
  return async (dispatch, getState) => {
    const state = getState();
    const { uid } = state.firebaseState.auth;
    if (!uid || uid === 0) return;

    let { id: beatportTrackId, name, mixName } = track;
    const artists = track.artists.reduce(
      (acc, artist, idx) => (acc += (idx > 0 ? ' ' : '') + artist.name),
      '',
    );

    mixName = mixName
      .replace('Original', '')
      .replace('Mix', '')
      .replace('Version', '')
      .replace('Remix', '');

    const addedDate = Date.now();

    const db = firebase.database();
    const userDownloadQueueRef = db.ref(`users/${uid}/downloadQueue`);

    let success = true;
    const queueId = userDownloadQueueRef.push(
      {
        beatportTrackId,
        searchTerms: {
          artists,
          name,
          mixName,
        },
        status: 'initiated',
        addedDate,
      },
      (error) => {
        if (error) {
          success = false;
        }
      },
    ).key;

    db.ref(`downloadQueue/${queueId}`).set(
      {
        beatportTrackId,
        searchTerms: {
          artists,
          name,
          mixName,
        },
        status: 'initiated',
        addedDate,
        addedBy: uid,
      },
      (error) => {
        if (error) {
          console.error('Error setting downloadQueue', error);
          success = false;
        }
      },
    );

    dispatch({
      type: DOWNLOAD_TRACK_FROM_QUEUE,
      payload: {
        queueId,
        success,
      },
    });
  };
};

export const updateTrackStatus = (queueId, status) => {
  return (dispatch, getState) => {
    const state = getState();
    const { uid } = state.firebaseState.auth;
    const db = firebase.database();
    const itemRef = db.ref(`users/${uid}/downloadQueue/${queueId}`);
    const globalItemRef = db.ref(`downloadQueue/${queueId}`);

    itemRef.update({
      status,
    });

    globalItemRef.update({
      status,
    });
  };
};
