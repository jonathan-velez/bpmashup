import firebase from 'firebase';
import { v4 } from 'node-uuid';
import moment from 'moment';

import {
  LOAD_TRACK,
  GET_YOUTUBE_LINK,
  TOGGLE_LOVE_TRACK,
  ADD_PLAYLIST,
  ADD_TO_PLAYLIST,
  REMOVE_FROM_PLAYLIST,
  EDIT_PLAYLIST_NAME,
  DELETE_PLAYLIST,
  TOGGLE_LOVE_ARTIST,
  DOWNLOAD_TRACK,
  ADD_TRACK_TO_NO_DOWNLOAD_LIST,
} from '../constants/actionTypes';
import { openLoginModalWindow } from '../actions/ActionCreators';

export const activityLogger = store => next => action => {
  const logTrack = (track, userId, type) => {
    const logTypes = ['downloads', 'trackPlaysAll', 'noDownloads'];
    if(!logTypes.includes(type)) {
      return;
    }

    const db = firebase.database();
    const downloadRef = db.ref(`${type}/users/${userId}`);

    // total count for all downloads by user
    downloadRef.child('totalCount').transaction(currentValue => {
      return (currentValue || 0) + 1;
    });

    // total count for all downloads by all ussers
    downloadRef.parent.parent.child('totalCount').transaction(currentValue => {
      return (currentValue || 0) + 1;
    });

    const { id: trackId, genres, artists, label } = track;

    // track object
    downloadRef.child('tracks').child(trackId).set(track);
    // trackId with timestamp
    downloadRef.child('trackIds').child(moment().format()).set(trackId);

    // genres
    genres.forEach(genre => {
      // genre name
      downloadRef.child('genresNames').child(genre.slug).transaction(currentValue => (currentValue || 0) + 1);
      // genre ids
      downloadRef.child('genresIds').child(genre.id).transaction(currentValue => (currentValue || 0) + 1);
    })

    // artists
    artists.forEach(artist => {
      // artist name
      downloadRef.child('artistsNames').child(artist.slug).transaction(currentValue => (currentValue || 0) + 1);
      // artist id
      downloadRef.child('artistsIds').child(artist.id).transaction(currentValue => (currentValue || 0) + 1);
    })
    
    // label name
    downloadRef.child('labelsNames').child(label.slug).transaction(currentValue => (currentValue || 0) + 1); // TODO, abstract transaction out
    // label name
    downloadRef.child('labelsIds').child(label.id).transaction(currentValue => (currentValue || 0) + 1);
  }

  const id = v4();
  const state = store.getState();

  let userId = 0;
  const { auth } = state.firebaseState;

  const { payload: track, type } = action;

  if (auth.isLoaded && !auth.isEmpty) {
    userId = auth.uid
  }

  switch (type) {
    case LOAD_TRACK:
      logTrack(track, userId, 'trackPlaysAll');
      break;
    case GET_YOUTUBE_LINK:
      firebase.set(`/trackPlaysYouTube/${id}`, {
        id,
        userId,
        track: state.mediaPlayer.loadedTrack,
        youTubeId: track.data[0].id.videoId,
        timeStamp: moment().format(),
      });
      break;
    case DOWNLOAD_TRACK:
      logTrack(track, userId, 'downloads');
      break;
    case ADD_TRACK_TO_NO_DOWNLOAD_LIST:
      logTrack(track, userId, 'noDownloads');
      break;
    default:
      break;
  }

  next(action);
}

const protectedActions = [TOGGLE_LOVE_TRACK, ADD_PLAYLIST, ADD_TO_PLAYLIST, REMOVE_FROM_PLAYLIST, EDIT_PLAYLIST_NAME, DELETE_PLAYLIST, TOGGLE_LOVE_ARTIST];

export const checkProtectedAction = store => next => action => {
  const state = store.getState();
  const { auth } = state.firebaseState;

  if ((!auth.isLoaded || auth.isEmpty) && protectedActions.includes(action.type)) {
    next(openLoginModalWindow(action));
  } else {
    next(action);
  }
}
