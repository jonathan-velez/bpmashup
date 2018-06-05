import firebase from 'firebase';
import { ADD_PLAYLIST, REMOVE_FROM_PLAYLIST, ADD_TO_PLAYLIST, EDIT_PLAYLIST_NAME, DELETE_PLAYLIST, LOAD_PLAYLISTS } from '../constants/actionTypes';

const setFirebase = (state) => {
  const { uid } = state.firebaseState.auth;
  const { playlistList } = state;

  if (!uid || uid === 0) return;
  
  firebase.set(`users/${uid}/playlists/`, playlistList);
}

export const addNewPlaylist = (playList) => {
  return (dispatch, getState) => { 
    dispatch({
      type: ADD_PLAYLIST,
      payload: playList
    });

    setFirebase(getState());
  }
}

export const removeFromPlaylist = track => {
  return (dispatch, getState) => {
    dispatch({
      type: REMOVE_FROM_PLAYLIST,
      payload: track
    });

    setFirebase(getState());
  }
}

export const addToPlaylist = payload => {
  return (dispatch, getState) => {
    dispatch({
      type: ADD_TO_PLAYLIST,
      payload
    });
    
    setFirebase(getState());
  }
}

export const editPlaylistName = payload => {
  return (dispatch, getState) => {
    dispatch({
      type: EDIT_PLAYLIST_NAME,
      payload
    });

    setFirebase(getState());
  }
}

export const deletePlaylist = payload => {
  return (dispatch, getState) => {
    dispatch({
      type: DELETE_PLAYLIST,
      payload
    });

    setFirebase(getState());
  }
}

export const loadPlaylists = playlists => {
  return (dispatch, getState) => {
    dispatch({
      type: LOAD_PLAYLISTS,
      payload: playlists,
    })
  }
}
