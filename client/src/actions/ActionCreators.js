import Axios from 'axios';

import { API_MOST_POPULAR, API_GENRES, API_SEARCH, API_AUTOCOMPLETE, API_GET_YOUTUBE_LINK } from '../constants/apiPaths';
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
  SET_CONFIRM
} from '../constants/actionTypes';

export const startAsync = () => {
  return {
    type: START_ASYNC
  }
}

export const fetchTracks = (type = 'genre', id, name, page = 1, perPage = 20) => {
  const request = Axios.get(`${API_MOST_POPULAR}/${type}?s=${name}&id=${id}&page=${page}&perPage=${perPage}`);

  return {
    type: FETCH_TRACKS,
    payload: request
  }
}

export const searchTracks = (searchTerm, page = 1, perPage = 20) => {
  console.log(searchTerm);
  const request = Axios.get(`${API_SEARCH}?query=${searchTerm}&facets=fieldType:track&sortBy=publishDate+DESC&perPage=${perPage}&page=${page}`);

  return {
    type: SEARCH_TRACKS,
    payload: request
  }
}

export const fetchGenres = () => {
  const request = Axios.get(API_GENRES);

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
  console.log(d)
  return {
    type: UPDATE_SUGGESTION_INPUT_VALUE,
    value: d.newValue
  }
}

export const clearSuggestions = () => {
  return {
    type: CLEAR_SUGGESTIONS
  }
}

export const loadSuggestions = ({value}) => {  
  const request = Axios.get(`${API_AUTOCOMPLETE}?query=${value}`);

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

export const getYoutubeLink = searchString => {
  const request = Axios.get(`${API_GET_YOUTUBE_LINK}?q=${searchString}`);
  return {
    type: GET_YOUTUBE_LINK,
    payload: request
  }
}

export const loadYoutubeLink = youTubeLink => {
  console.log(youTubeLink)
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
