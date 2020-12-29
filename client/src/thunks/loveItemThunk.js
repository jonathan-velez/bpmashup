import firebase from 'firebase';
import { TOGGLE_LOVE_ITEM } from '../constants/actionTypes';

export const toggleLoveItem = (itemType, item, add) => {
  return (dispatch, getState) => {
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

    dispatch({
      type: TOGGLE_LOVE_ITEM,
      payload: {
        itemType,
        item,
        add,
      },
    });
  };
};
