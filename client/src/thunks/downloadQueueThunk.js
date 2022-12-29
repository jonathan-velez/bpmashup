import firebase from 'firebase';

import {
  ADD_TRACK_TO_DOWNLOAD_QUEUE,
  START_ADD_TRACK_TO_DOWNLOAD_QUEUE,
} from '../constants/actionTypes';
import { generateActivityMessage } from '../utils/storeUtils';
import { trackHasBeenDownloaded, getUserId } from '../selectors';

export const purgeFailedFromPersonalQueue = (sendToast = true) => {
  return async (dispatch, getState) => {
    const state = getState();
    const uid = getUserId(state);

    if (!uid) {
      return generateActivityMessage(`Unable to find your user ID. Make sure you're logged in`);
    }

    const firestore = firebase.firestore();
    const queuePurge = firestore.collection(`users/${uid}/downloadQueue`);

    queuePurge.get().then((snapshot) => {
      if (snapshot.empty) {
        return generateActivityMessage('Nothing in your download queue', 'negative');
      }

      let purgeCount = 0;
      const batch = firestore.batch();

      snapshot.forEach((doc) => {
        const docData = doc.data();
        if (docData.status === 'notAvailable' && !docData.purged) {
          purgeCount++;
          batch.update(doc.ref, { purged: true });
        }
      });
      
      if(purgeCount === 0) {
        return generateActivityMessage('Nothing to purge', 'negative');
      }

      batch.commit();

      if (sendToast) {
        return generateActivityMessage(`${purgeCount} failed download${purgeCount > 1 ? 's have' : ' has'} been purged from your queue.`);
      }
    });
  }
}

export const addTrackToDownloadQueue = (track, sendToast = true) => {
  return async (dispatch, getState) => {
    const state = getState();
    const { firebaseState = {} } = state;
    const { auth = {} } = firebaseState;
    const { uid } = auth;
    if (!uid || uid === 0) return;

    let { id: beatportTrackId, name, mix_name } = track;
    const artists = track.artists.reduce(
      (acc, artist, idx) => (acc += (idx > 0 ? ' ' : '') + artist.name),
      '',
    );

    mix_name = mix_name
      .toLowerCase()
      .replace('mix', '')
      .replace('version', '')
      .replace('remix', '')
      .trim();

    // check if track already's been added
    if (trackHasBeenDownloaded(state, beatportTrackId)) {
      return generateActivityMessage(
        "You've already added this file. Please check your download queue.",
      );
    }

    // fresh download request, add to Firestore queues
    if (sendToast) {
      dispatch({
        type: START_ADD_TRACK_TO_DOWNLOAD_QUEUE,
      });
    }

    const fs = firebase.firestore();
    const downloadItem = {
      status: 'initiated',
      addedDate: firebase.firestore.Timestamp.now(),
      beatportTrackId,
      searchTerms: {
        artists,
        name,
        mix_name,
      },
      track: {
        ...track,
      },
    };

    // add to user's queue
    const queueAdd = await fs
      .collection(`users/${uid}/downloadQueue`)
      .add(downloadItem);

    // add to global download queue with id
    const { id } = queueAdd;
    if (id) {
      await fs
        .collection(`downloadQueue/`)
        .doc(id)
        .set({
          ...downloadItem,
          addedBy: uid,
        });

      dispatch({
        type: ADD_TRACK_TO_DOWNLOAD_QUEUE,
        payload: {
          success: true,
          queueId: id,
        },
      });
    }
    // TODO: handle mishaps here
  };
};

export const updateTrackStatus = (queueId, status) => {
  return (dispatch, getState) => {
    const state = getState();
    const { uid } = state.firebaseState.auth;
    const firestore = firebase.firestore();
    const userItemRef = firestore
      .collection('users')
      .doc(uid)
      .collection('downloadQueue')
      .doc(queueId);
    const globalItemRef = firestore.collection('downloadQueue').doc(queueId);

    const batch = firestore.batch();
    batch.update(userItemRef, { status });
    batch.update(globalItemRef, { status });
    batch.commit();
  };
};
