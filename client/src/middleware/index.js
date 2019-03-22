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
  TOGGLE_LOVE_ARTIST
} from '../constants/actionTypes';
import { openLoginModalWindow } from '../actions/ActionCreators';

export const activityLogger = store => next => action => {
  const logTrack = (track, userId) => {
    const { genres, artists, label, id } = track;

    genres.forEach(genre => {
      const genreRef = firebase.database().ref(`allTrackPlays/genres/${genre.slug}|${genre.id}`);
      genreRef.transaction(currentValue => {
        return (currentValue || 0) + 1;
      });

      if (userId) {
        const genreRefUser = firebase.database().ref(`users/${userId}/trackPlays/genres/${genre.slug}|${genre.id}`);
        genreRefUser.transaction(currentValue => {
          return (currentValue || 0) + 1;
        });
      }
    });

    artists.forEach(artist => {
      const artistRef = firebase.database().ref(`allTrackPlays/artists/${artist.slug}|${artist.id}`);
      artistRef.transaction(currentValue => {
        return (currentValue || 0) + 1;
      });

      if (userId) {
        const artistRefUser = firebase.database().ref(`users/${userId}/trackPlays/artists/${artist.slug}|${artist.id}`);
        artistRefUser.transaction(currentValue => {
          return (currentValue || 0) + 1;
        });
      }
    });

    const labelRef = firebase.database().ref(`allTrackPlays/label/${label.slug}|${label.id}`);
    labelRef.transaction(currentValue => {
      return (currentValue || 0) + 1;
    });

    const labelRefUser = firebase.database().ref(`users/${userId}/trackPlays/label/${label.slug}|${label.id}`);
    labelRefUser.transaction(currentValue => {
      return (currentValue || 0) + 1;
    });

    const trackIdRef = firebase.database().ref(`allTrackPlays/tracks/${id}`);
    trackIdRef.transaction(currentValue => {
      return (currentValue || 0) + 1;
    });

    const trackIdRefUser = firebase.database().ref(`users/${userId}/trackPlays/tracks/${id}`);
    trackIdRefUser.transaction(currentValue => {
      return (currentValue || 0) + 1;
    });
  }

  const id = v4();
  const state = store.getState();

  let userId = 0;
  const { auth } = state.firebaseState;

  if (auth.isLoaded && !auth.isEmpty) {
    userId = auth.uid
  }

  switch (action.type) {
    case LOAD_TRACK:
      firebase.set(`/trackPlays/${id}`, {
        id,
        userId,
        track: action.payload,
        timeStamp: moment().format(),
      });

      logTrack(action.payload, userId); // TODO use a setTimeout or something to delay the execution of the log until after 5 seconds of play time.
      break;
    case GET_YOUTUBE_LINK:
      firebase.set(`/trackPlaysYouTube/${id}`, {
        id,
        userId,
        track: state.mediaPlayer.loadedTrack,
        youTubeId: action.payload.data[0].id.videoId,
        timeStamp: moment().format(),
      });
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