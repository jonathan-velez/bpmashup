import firebase from 'firebase';
import {
  TOGGLE_LOVE_TRACK,
  TOGGLE_LOVE_LABEL,
  TOGGLE_LOVE_ARTIST,
  TOGGLE_LOVE_ITEM,
} from '../constants/actionTypes';

const setFirebase = (state, lovedPath, id) => {
  const { uid } = state.firebaseState.auth;

  if (!uid || uid === 0 || !lovedPath) {
    return;
  }

  const db = firebase.database();
  const lovedItemRef = db.ref(`users/${uid}/${lovedPath}/${id}`);

  lovedItemRef.transaction((currentValue) => {
    return currentValue > 0 ? 0 : 1;
  });
};

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

    const itemKeys = Object.keys(lovedItemState);
    if (itemKeys.includes(id)) {
      add = false;
    }

    const payload = {
      id,
      add,
    };

    dispatch({
      type: lovedActionType,
      payload,
    });

    setFirebase(getState(), lovedPath, id);
  };
};

export const loveLabelNew = (itemType, item, add) => {
  return (dispatch, getState) => {
    const firestore = firebase.firestore();
    const { uid } = getState().firebaseState.auth;

    const ref = firestore
      .collection(`users`)
      .doc(uid)
      .collection('loves')
      .doc('labels');

    ref.set(
      {
        [item.id]: {
          ...item,
          loved: add ? true : false,
        },
      },
      { merge: true },
    );

    dispatch({
      type: TOGGLE_LOVE_ITEM,
      payload: {
        itemType,
        add,
      },
    });
  };
};

export const toggleItemNew = (itemType, item, add) => {
  return (dispatch, getState) => {
    dispatch({
      type: TOGGLE_LOVE_ITEM,
      payload: {
        itemType,
        item,
        add,
      },
    });

    const firestore = firebase.firestore();
    const { uid } = getState().firebaseState.auth;

    if (!uid) return;

    const ref = firestore
      .collection(`users`)
      .doc(uid)
      .collection('loves')
      .doc(`${itemType}s`);

    ref.set(
      {
        [item.id]: {
          ...item,
          loved: add ? true : false,
        },
      },
      { merge: true },
    );
  };
};
