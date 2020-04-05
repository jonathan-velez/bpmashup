import React from 'react';

import LoginForm from '../components/LoginForm';
import { callAPIorCache } from '../seessionStorageCache';

import {
  API_GENRES,
  API_AUTOCOMPLETE,
} from '../constants/apiPaths';

import {
  LOAD_TRACK,
  PLAY_PAUSE,
  PLAY,
  PAUSE,
  SEEK_MOUSE_DOWN,
  SEEK_CHANGE,
  SEEK_MOUSE_UP,
  UPDATE_TRACK_PROGRESS,
  SET_DURATION,
  START_ASYNC,
  FETCH_GENRES,
  UPDATE_SUGGESTION_INPUT_VALUE,
  CLEAR_SUGGESTIONS,
  LOAD_SUGGESTIONS,
  TOGGLE_MUTE,
  LOAD_YOUTUBE_URL,
  SET_VOLUME,
  LOAD_TRACKS,
  OPEN_MODAL,
  STOP_ASYNC,
  TOGGLE_TRACKLIST_VIEW,
  CLEAR_PLAYLISTS,
  CLEAR_DOWNLOADS,
  CLEAR_NO_DOWNLOADS,
  CLEAR_LOVED_TRACKS,
  CLEAR_LOVED_ARTISTS,
  CLEAR_LOVED_ARTISTS_DETAILS,
  CLEAR_LOVED_LABELS,
  CLEAR_LOVED_LABELS_DETAILS,
  ADD_ACTION_MESSAGE,
  REMOVE_ACTION_MESSAGE,
  ADD_TRACK_TO_DOWNLOAD_QUEUE,
} from '../constants/actionTypes';

export const startAsync = () => {
  return {
    type: START_ASYNC
  }
}

export const stopAsync = () => {
  return {
    type: STOP_ASYNC
  }
}

export const fetchGenres = async () => {
  const request = await callAPIorCache(API_GENRES);

  return {
    type: FETCH_GENRES,
    payload: request
  }
}

export const loadTrack = track => {
  return {
    type: LOAD_TRACK,
    payload: track
  }
}

export const playPause = () => {
  return {
    type: PLAY_PAUSE
  }
}

export const play = () => {
  return {
    type: PLAY
  }
}

export const pause = () => {
  return {
    type: PAUSE
  }
}

export const seekMouseDown = () => {
  return {
    type: SEEK_MOUSE_DOWN
  }
}

export const seekChange = position => {
  return {
    type: SEEK_CHANGE,
    payload: position
  }
}

export const seekMouseUp = () => {
  return {
    type: SEEK_MOUSE_UP
  }
}

export const updateTrackProgress = state => {
  return {
    type: UPDATE_TRACK_PROGRESS,
    payload: state
  }
}

export const setDuration = duration => {
  return {
    type: SET_DURATION,
    payload: duration
  }
}

export const updateSuggestionInputValue = (e, d) => {
  return {
    type: UPDATE_SUGGESTION_INPUT_VALUE,
    payload: d.newValue
  }
}

export const clearSuggestions = () => {
  return {
    type: CLEAR_SUGGESTIONS
  }
}

export const loadSuggestions = async ({ value }) => {
  const request = await callAPIorCache(`${API_AUTOCOMPLETE}?query=${value}`);

  return {
    type: LOAD_SUGGESTIONS,
    payload: request
  }
}

export const toggleMute = () => {
  return {
    type: TOGGLE_MUTE
  }
}

export const loadYoutubeLink = youTubeLink => {
  return {
    type: LOAD_YOUTUBE_URL,
    payload: youTubeLink
  }
}

export const setVolume = volume => {
  return {
    type: SET_VOLUME,
    payload: volume
  }
}

export const loadTracks = tracks => {
  return {
    type: LOAD_TRACKS,
    payload: tracks
  }
}

export const openModalWindow = payload => {
  return {
    type: OPEN_MODAL,
    payload
  }
}

export const toggleTracklistView = payload => {
  return {
    type: TOGGLE_TRACKLIST_VIEW,
    payload
  }
}

export const clearPlaylists = () => {
  return {
    type: CLEAR_PLAYLISTS
  }
}

export const openLoginModalWindow = actionPending => {
  return {
    type: OPEN_MODAL,
    payload: {
      open: true,
      title: 'Login',
      body: <LoginForm />,
      headerIcon: 'sign in',
      actionPending,
    }
  }
}

export const clearDownloads = () => {
  return {
    type: CLEAR_DOWNLOADS,
  }
}

export const clearNoDownloads = () => {
  return {
    type: CLEAR_NO_DOWNLOADS,
  }
}

export const clearLovedTracks = () => {
  return {
    type: CLEAR_LOVED_TRACKS,
  }
}

export const clearLovedArtists = () => {
  return {
    type: CLEAR_LOVED_ARTISTS,
  }
}

export const clearLovedArtistsDetails = () => {
  return {
    type: CLEAR_LOVED_ARTISTS_DETAILS,
  }
}

export const clearLovedLabels = () => {
  return {
    type: CLEAR_LOVED_LABELS,
  }
}

export const clearLovedLabelsDetails = () => {
  return {
    type: CLEAR_LOVED_LABELS_DETAILS,
  }
}

export const setActionMessage = payload => {
  return {
    type: ADD_ACTION_MESSAGE,
    payload
  }
}

export const removeActionMessage = id => {
  return {
    type: REMOVE_ACTION_MESSAGE,
    payload: id,
  }
}
