import firebase from 'firebase';
import {
  DOWNLOAD_TRACK_FROM_QUEUE,
  // ADD_TRACK_TO_DOWNLOAD_QUEUE,
  // UPDATE_TRACK_STATUS_IN_DOWNLOAD_QUEUE,
} from '../constants/actionTypes';

export const addTrackToDownloadQueue = (track) => {
  return (dispatch, getState) => {
    const state = getState();
    const { uid } = state.firebaseState.auth;
    if (!uid || uid === 0) return;

    const { id: beatportTrackId } = track;
    const addedDate = Date.now();

    const db = firebase.database();
    const userDownloadQueueRef = db.ref(`users/${uid}/downloadQueue`);

    let success = true;
    const queueId = userDownloadQueueRef.push(
      {
        beatportTrackId,
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

// TODO: add download thunk - update queues to downloaded status

export const updateTrackStatus = (queueId, status) => {
  return (dispatch, getState) => {
    const state = getState();
    const { uid } = state.firebaseState.auth;
    const db = firebase.database();
    const itemRef = db.ref(`users/${uid}/downloadQueue/${queueId}`);

    if (itemRef) {
      itemRef.update({
        status,
      });
    }
  };
};

/*
{
  queueId: xxxx,
  beatportTrackId: yyyy,
  status: abc,
  addedDate: zzzz,
  downloadDate: aaa,
  errors: true,
  errorCodes: {},
  url: kjxnczkjc,
}

*/
