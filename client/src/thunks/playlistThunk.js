import firebase from 'firebase';
import { ADD_PLAYLIST } from '../constants/actionTypes';

export const addPlaylistNew = (playList) => {
  console.log('inside addPlaylistNew', playList)
  return (dispatch, getState) => {    
    console.log('getState inside thunk', getState());

    // add playlist to Redux store
    dispatch({
      type: ADD_PLAYLIST,
      payload: playList
    });

    const { uid } = getState().firebaseState.auth;

    // add playlist to Firebase
    firebase.push(`users/${uid}/playlists/`, playList)
  }
}
