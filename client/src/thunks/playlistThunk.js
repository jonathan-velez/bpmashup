import firebase from 'firebase';

import {
  LOAD_PLAYLIST_DETAILS,
  START_ASYNC,
  STOP_ASYNC,
} from '../constants/actionTypes';
import { generateActivityMessage } from '../utils/storeUtils';

const _getUserId = (state) => {
  return state.firebaseState.auth.uid;
};

const _getUserPlaylistsRef = (userId) => {
  const firestore = firebase.firestore();
  return firestore
    .collection(`users`)
    .doc(userId)
    .collection('playlists');
};

export const addNewPlaylist = (newPlaylist) => {
  return async (dispatch, getState) => {
    const userId = _getUserId(getState());

    if (!userId) {
      return generateActivityMessage(
        'Error adding new playlist. No user found.',
        'error',
      );
    }

    const { name, track } = newPlaylist;
    const { id: trackId } = track;

    const dateAdded = firebase.firestore.Timestamp.fromDate(new Date());

    const newTrack = {
      ...track,
      dateAdded,
    };

    const payload = {
      name,
      dateAdded,
      active: true,
      trackIds: [trackId],
    };

    try {
      // create new playlist document
      const playlistsRef = _getUserPlaylistsRef(userId);
      const newPlaylistRef = playlistsRef.doc();
      const setNewPlaylist = newPlaylistRef.set(payload);

      // add track document to tracks collection
      const trackDocRef = newPlaylistRef
        .collection('tracks')
        .doc(trackId.toString());
      const setNewTrack = trackDocRef.set(newTrack);

      await setNewPlaylist;
      await setNewTrack;

      generateActivityMessage('Playlist created.');
    } catch (error) {
      generateActivityMessage(`Error creating new playlist. ${error}`, 'error');
    }
  };
};

export const editPlaylistName = ({ playlistId, newName }) => {
  return async (dispatch, getState) => {
    const userId = _getUserId(getState());
    if (!playlistId) {
      return generateActivityMessage(
        'Error editing playlist name. No playlist ID found.',
        'error',
      );
    }

    if (!userId) {
      return generateActivityMessage(
        'Error editing playlist name. No user found.',
        'error',
      );
    }

    try {
      const playlistsRef = _getUserPlaylistsRef(userId);
      const playlistDocumentRef = playlistsRef.doc(playlistId);
      await playlistDocumentRef.update({ name: newName });

      generateActivityMessage('Playlist name edited.');
    } catch (error) {
      generateActivityMessage(`Error editing playlist name. ${error}`, 'error');
    }
  };
};

export const deletePlaylist = (playlistId) => {
  return async (dispatch, getState) => {
    const userId = _getUserId(getState());
    if (!playlistId) {
      return generateActivityMessage(
        'Error deleting playlist. No playlist ID found.',
        'error',
      );
    }

    if (!userId) {
      return generateActivityMessage(
        'Error deleting playlist. No user found.',
        'error',
      );
    }

    try {
      const playlistsRef = _getUserPlaylistsRef(userId);
      const playlistDocumentRef = playlistsRef.doc(playlistId);
      await playlistDocumentRef.update({ active: false });

      generateActivityMessage('Playlist deleted.');
    } catch (error) {
      generateActivityMessage(`Error deleting playlist. ${error}`, 'error');
    }
  };
};

export const addTrackToPlaylist = ({ playlistId, track }) => {
  return async (dispatch, getState) => {
    const userId = _getUserId(getState());
    if (!userId) {
      return generateActivityMessage(
        'Error adding track to playlist. No user found.',
        'error',
      );
    }

    if (!playlistId) {
      return generateActivityMessage(
        'Error adding track to playlist. No playlist ID found.',
        'error',
      );
    }

    const { id: trackId } = track;
    const dateAdded = firebase.firestore.Timestamp.fromDate(new Date());
    const newTrack = {
      ...track,
      dateAdded,
    };

    try {
      const playlistsRef = _getUserPlaylistsRef(userId);
      const playlistRef = playlistsRef.doc(playlistId);

      const trackDocRef = playlistRef
        .collection('tracks')
        .doc(trackId.toString());
      const setTrack = trackDocRef.set(newTrack);

      const setNewTrack = playlistRef.update({
        trackIds: firebase.firestore.FieldValue.arrayUnion(+trackId),
      });

      await setTrack;
      await setNewTrack;

      generateActivityMessage('Track added to playlist.');
    } catch (error) {
      generateActivityMessage(
        `Error adding track to playlist. ${error}`,
        'error',
      );
    }
  };
};

export const removeTrackFromPlaylist = ({ playlistId, trackId }) => {
  return async (dispatch, getState) => {
    const userId = _getUserId(getState());
    if (!userId) {
      return generateActivityMessage(
        'Error removing track from playlist. No user found.',
        'error',
      );
    }

    if (!playlistId) {
      return generateActivityMessage(
        'Error removing track from playlist No playlist ID found.',
        'error',
      );
    }

    try {
      const playlistsRef = _getUserPlaylistsRef(userId);
      const playlistRef = playlistsRef.doc(playlistId);

      const trackRef = playlistRef.collection('tracks').doc(trackId);
      const track = await trackRef.get();

      if (track.exists) {
        // remove track from collection
        const deleteTrack = trackRef.delete();

        // remove track from list of trackIds
        const deleteTrackId = playlistRef.update({
          trackIds: firebase.firestore.FieldValue.arrayRemove(+trackId),
        });

        await deleteTrack;
        await deleteTrackId;

        generateActivityMessage('Track removed from playlist.');
      }
    } catch (error) {
      generateActivityMessage(
        `Error removing track from playlist. ${error}`,
        'error',
      );
    }
  };
};

export const getPlaylistDetails = (playlistId) => {
  return async (dispatch, getState) => {
    const userId = _getUserId(getState());
    if (!userId) {
      return generateActivityMessage(
        'Error fetching playlist details. No user found.',
        'error',
      );
    }

    if (!playlistId) {
      return generateActivityMessage(
        'Error fetching playlist details. No playlist ID found.',
        'error',
      );
    }

    try {
      dispatch({
        type: START_ASYNC,
      });
      
      const playlistsRef = _getUserPlaylistsRef(userId);
      const playlistTracksRef = playlistsRef
        .doc(playlistId)
        .collection('tracks');

      // register a listener on the playlist tracks collection and load into state
      const unsubscribe = playlistTracksRef.onSnapshot((tracks) => {
        let playlistTracks = {};
        tracks.forEach((track) => {
          const details = track.data();
          playlistTracks[details.id] = details;
        });

        const payload = {
          playlistId,
          playlistTracks,
          unsubscribe,
        };

        dispatch({
          type: LOAD_PLAYLIST_DETAILS,
          payload,
        });
      });
    } catch (error) {
      generateActivityMessage(
        `Error fetching playlist details. ${error}`,
        'error',
      );
    } finally {
      dispatch({
        type: STOP_ASYNC,
      });
    }
  };
};
