import firebase from 'firebase';
import { TOGGLE_LOVE_TRACK, TOGGLE_LOVE_LABEL, TOGGLE_LOVE_ARTIST } from '../constants/actionTypes';

const setFirebase = (state, lovedPath, id) => {
  const { uid } = state.firebaseState.auth;

  if (!uid || uid === 0 || !lovedPath) {
    return;
  }

  const db = firebase.database();
  const lovedItemRef = db.ref(`users/${uid}/${lovedPath}/${id}`);

  lovedItemRef.transaction(currentValue => {
    return currentValue > 0 ? 0 : 1;
  })
}

export const toggleLoveItem = (type, id) => {
  return (dispatch, getState) => {
    let lovedPath = '';
    let lovedActionType = '';

    switch (type) {
      case 'artist':
        lovedPath = 'lovedArtists';
        lovedActionType = TOGGLE_LOVE_ARTIST;
        break;
      case 'label':
        lovedPath = 'lovedLabels';
        lovedActionType = TOGGLE_LOVE_LABEL;
        break;
      case 'track':
        lovedPath = 'lovedTracks';
        lovedActionType = TOGGLE_LOVE_TRACK;
        break;
      default:
        break;
    }

    const lovedItemState = getState()[lovedPath];

    let add = true;

    if (lovedItemState.includes(id)) {
      add = false;
    }

    const payload = {
      id,
      add
    }

    dispatch({
      type: lovedActionType,
      payload
    });

    setFirebase(getState(), lovedPath, id);
  }
}
