import firebase from 'firebase';
import { TOGGLE_LOVE_TRACK } from '../constants/actionTypes';

const setFirebase = (state, typePath, trackId) => {
  const { uid } = state.firebaseState.auth;
  if (!uid || uid === 0) return;

  const db = firebase.database();
  const dbRef = db.ref(`users/${uid}/${typePath}/${trackId}`);

  dbRef.transaction(currentValue => {
    return currentValue > 0 ? 0 : 1;
  })
}

export const toggleLoveTrack = (type, trackId) => {
  return (dispatch, getState) => {
    let typePath = '';
    let typeDispatch = TOGGLE_LOVE_TRACK;

    switch (type) {
      case 'artist':
        typeDispatch = 'TOGGLE_FOLLOW_ARTIST';
        break;
      case 'label':
        typeDispatch = 'TOGGLE_FOLLOW_DISPATCH';
        break;
      default:
        typeDispatch = TOGGLE_LOVE_TRACK;
    }

    const { lovedTracks } = getState();
    let add = true;

    if (lovedTracks[type] && lovedTracks[type].includes(trackId)) {
      add = false;
    }

    const payload = {
      type,
      trackId,
      add
    }

    dispatch({
      type: typeDispatch,
      payload
    });

    setFirebase(getState(), typePath, trackId);
  }
}
