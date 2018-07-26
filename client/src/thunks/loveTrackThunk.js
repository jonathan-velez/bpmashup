import firebase from 'firebase';
import { TOGGLE_LOVE_TRACK } from '../constants/actionTypes';

const setFirebase = (state, trackId) => {
  const { uid } = state.firebaseState.auth;

  if (!uid || uid === 0) return;

  const db = firebase.database();
  const lovedTracksRef = db.ref(`users/${uid}/lovedTracks/${trackId}`);

  lovedTracksRef.transaction(currentValue => {
    return currentValue > 0 ? 0 : 1;
  })
}

export const toggleLoveTrack = (trackId) => {
  return (dispatch, getState) => {
    const { lovedTracks } = getState();
    let add = true;

    if (lovedTracks.includes(trackId)) {
      add = false;
    }

    const payload = {
      trackId,
      add
    }

    dispatch({
      type: TOGGLE_LOVE_TRACK,
      payload
    });

    setFirebase(getState(), trackId);
  }
}
