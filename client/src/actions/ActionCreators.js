import Axios from 'axios';
import { callAPIorCache } from '../seessionStorageCache';

import {
  API_MOST_POPULAR,
  API_GENRES,
  API_SEARCH,
  API_AUTOCOMPLETE,
  API_GET_YOUTUBE_LINK,
  API_SIMILAR_TRACKS } from '../constants/apiPaths';

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
  FETCH_TRACKS,
  FETCH_GENRES,
  SEARCH_TRACKS,
  UPDATE_SUGGESTION_INPUT_VALUE,
  CLEAR_SUGGESTIONS,
  LOAD_SUGGESTIONS,
  TOGGLE_MUTE,
  GET_YOUTUBE_LINK,
  LOAD_YOUTUBE_URL,
  SET_VOLUME,
  LOAD_TRACKS,
  OPEN_CONFIRM,
  RESET_CONFIRM,
  SET_CONFIRM,
  OPEN_MODAL,
  STOP_ASYNC,
  TOGGLE_TRACKLIST_VIEW,
  CLEAR_PLAYLISTS
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

export const fetchTracks = async (type = 'genre', id, name, page = 1, perPage = 20, endPoint = API_MOST_POPULAR) => {
  console.log('fetchTracks action')
  const request = await callAPIorCache(`${endPoint}/${type}?s=${name}&id=${id}&page=${page}&perPage=${perPage}`);

  return {
    type: FETCH_TRACKS,
    payload: request
  }
}

export const searchTracks = async (searchTerm, page = 1, perPage = 20) => {
  const request = await callAPIorCache(`${API_SEARCH}?query=${searchTerm}&facets=fieldType:track&sortBy=publishDate+DESC&perPage=${perPage}&page=${page}`);

  return {
    type: SEARCH_TRACKS,
    payload: request
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

export const updateSuggestionInputValue = (e,d) => {
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

export const loadSuggestions = async  ({value}) => {  
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

export const getYoutubeLink = async searchString => {
  const request = await callAPIorCache(`${API_GET_YOUTUBE_LINK}?q=${searchString}`);
  return {
    type: GET_YOUTUBE_LINK,
    payload: request
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

export const openConfirm = payload => {
  return {
    type: OPEN_CONFIRM,
    payload
  }
}

export const resetConfirm = () => {
  return {
    type: RESET_CONFIRM
  }
}

export const setConfirm = payload => {
  return {
    type: SET_CONFIRM,
    payload,
  }
}

export const fetchTracksSimilar = async (trackId, page = 1, perPage = 20) => {
  const request = await callAPIorCache(`${API_SIMILAR_TRACKS}?id=${trackId}&perPage=${perPage}&page=${page}`);

  return {
    type: SEARCH_TRACKS,
    payload: request
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
