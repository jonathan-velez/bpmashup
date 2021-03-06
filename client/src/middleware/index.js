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
  START_ADD_TRACK_TO_DOWNLOAD_QUEUE,
  TOGGLE_LOVE_ITEM,
} from '../constants/actionTypes';
import { openLoginModalWindow } from '../actions/ActionCreators';
import { generateActivityMessage } from '../utils/storeUtils';

export const activityLogger = (store) => (next) => (action) => {
  const logTrack = (track, userData, type) => {
    const { userId = 0, userDisplayName = '', userEmail = '' } = userData;

    const logTypes = ['downloads', 'trackPlaysAll', 'noDownloads'];
    if (!logTypes.includes(type)) {
      return;
    }

    const db = firebase.database();
    const userDataRef = db.ref(`${type}/users/${userId}`);

    // set user's name and email
    userDataRef.child('userData').set({ userDisplayName, userEmail });

    // total count for all downloads by user
    userDataRef.child('totalCount').transaction((currentValue) => {
      return (currentValue || 0) + 1;
    });

    // total count for all downloads by all ussers
    userDataRef.parent.parent
      .child('totalCount')
      .transaction((currentValue) => {
        return (currentValue || 0) + 1;
      });

    const { id: trackId, genres, artists, label } = track;

    // track object
    userDataRef
      .child('tracks')
      .child(trackId)
      .set(track);
    // trackId with timestamp
    userDataRef
      .child('trackIds')
      .child(moment().format())
      .set(trackId);

    // genres
    genres.forEach((genre) => {
      // genre name
      userDataRef
        .child('genresNames')
        .child(genre.slug)
        .transaction((currentValue) => (currentValue || 0) + 1);
      // genre ids
      userDataRef
        .child('genresIds')
        .child(genre.id)
        .transaction((currentValue) => (currentValue || 0) + 1);
    });

    // artists
    artists.forEach((artist) => {
      // artist name
      userDataRef
        .child('artistsNames')
        .child(artist.slug)
        .transaction((currentValue) => (currentValue || 0) + 1);
      // artist id
      userDataRef
        .child('artistsIds')
        .child(artist.id)
        .transaction((currentValue) => (currentValue || 0) + 1);
    });

    // label name
    userDataRef
      .child('labelsNames')
      .child(label.slug)
      .transaction((currentValue) => (currentValue || 0) + 1); // TODO, abstract transaction out
    // label name
    userDataRef
      .child('labelsIds')
      .child(label.id)
      .transaction((currentValue) => (currentValue || 0) + 1);
  };

  // TODO: take in optional positive/negative and icon parameters. Icon would be cool to send a music one for track playing

  const id = v4();
  const state = store.getState();

  let userId = 0;
  let userDisplayName = '';
  let userEmail = '';
  const userData = {};
  const { auth } = state.firebaseState;

  const { payload: track, type } = action;

  if (auth.isLoaded && !auth.isEmpty) {
    const { uid, displayName, email } = auth;

    userId = uid;
    userDisplayName = displayName;
    userEmail = email;

    Object.assign(userData, { userId, userDisplayName, userEmail });
  }

  switch (type) {
    case LOAD_TRACK:
      // logTrack(track, userData, 'trackPlaysAll');
      // generateActivityMessage(`Playing track - ${track.title}`);
      break;
    case GET_YOUTUBE_LINK:
      firebase.set(`/trackPlaysYouTube/${id}`, {
        id,
        userId,
        track: state.mediaPlayer.loadedTrack,
        youTubeId: track.data.id.videoId,
        timeStamp: moment().format(),
      });
      break;
    case DOWNLOAD_TRACK:
      logTrack(track, userData, 'downloads');
      break;
    case ADD_TRACK_TO_NO_DOWNLOAD_LIST:
      logTrack(track, userData, 'noDownloads');
      break;
    case TOGGLE_LOVE_TRACK:
      {
        let message;
        if (action.payload.add) {
          message = 'Track added to your Love list';
        } else {
          message = 'Track removed from your Love list';
        }
        generateActivityMessage(message);
      }
      break;
    case ADD_TO_PLAYLIST:
      generateActivityMessage('Track added to playlist');
      break;
    case REMOVE_FROM_PLAYLIST:
      generateActivityMessage('Track removed from playlist');
      break;
    case START_ADD_TRACK_TO_DOWNLOAD_QUEUE:
      generateActivityMessage('Track added to download queue');
      break;
    case TOGGLE_LOVE_ITEM: {
      const { itemType } = action.payload;
      generateActivityMessage(
        `${itemType.charAt(0).toUpperCase()}${itemType.slice(1)} ${
          action.payload.add ? 'added to' : 'removed from'
        } your love list.`,
      );
      break;
    }

    default:
      break;
  }

  next(action);
};

const protectedActions = [
  TOGGLE_LOVE_TRACK,
  ADD_PLAYLIST,
  ADD_TO_PLAYLIST,
  REMOVE_FROM_PLAYLIST,
  EDIT_PLAYLIST_NAME,
  DELETE_PLAYLIST,
  TOGGLE_LOVE_ARTIST,
  TOGGLE_LOVE_ITEM,
];

export const checkProtectedAction = (store) => (next) => (action) => {
  const state = store.getState();
  const { auth } = state.firebaseState;

  if (
    (!auth.isLoaded || auth.isEmpty) &&
    protectedActions.includes(action.type)
  ) {
    next(openLoginModalWindow(action));
  } else {
    next(action);
  }
};
