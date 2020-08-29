import firebase from 'firebase';

import {
  ADD_TRACK_TO_DOWNLOAD_QUEUE,
  START_ADD_TRACK_TO_DOWNLOAD_QUEUE,
} from '../constants/actionTypes';
import { generateActivityMessage } from '../utils/storeUtils';
import { trackHasBeenDownloaded } from '../selectors';

export const addTrackToDownloadQueue = (track, trackType = 'beatport') => {
  return async (dispatch, getState) => {
    const state = getState();
    const { uid } = state.firebaseState.auth;
    if (!uid || uid === 0) return;

    let { id: beatportTrackId, name, mixName = '' } = track;
    const artists = track.artists.reduce(
      (acc, artist, idx) => (acc += (idx > 0 ? ' ' : '') + artist.name),
      '',
    );

    mixName = mixName
      .replace('Original', '')
      .replace('Mix', '')
      .replace('Version', '')
      .replace('Remix', '');

    // check if track already's been added
    if (trackHasBeenDownloaded(state, beatportTrackId)) {
      return generateActivityMessage(
        "You've already added this file. Please check your download queue.",
      );
    }

    // fresh download request, add to Firestore queues
    dispatch({
      type: START_ADD_TRACK_TO_DOWNLOAD_QUEUE,
    });

    const fs = firebase.firestore();
    const downloadItem = {
      trackType,
      status: 'initiated',
      addedDate: firebase.firestore.Timestamp.now(),
      beatportTrackId,
      searchTerms: {
        artists,
        name,
        mixName,
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
