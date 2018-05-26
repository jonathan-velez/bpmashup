import _ from 'lodash';

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
  TOGGLE_MUTE,
  SET_VOLUME,
  GET_YOUTUBE_LINK
} from '../constants/actionTypes';

const defaultState = {
  loadedUrl: null,
  sampleUrl: null,
  youTubeUrl: null,
  playing: true,
  volume: 1.0,
  muted: false,
  played: 0,
  loaded: 0,
  duration: 0,
  playbackRate: 1.0,
  loop: false,
  loadedTrack: {},
}

const mediaPlayer = (state = defaultState, action) => {
  switch (action.type) {
    case LOAD_TRACK:
      if (_.isEmpty(action.payload)) return state;
      
      return {
        ...state,
        loadedUrl: action.payload.sampleSecureUrl,
        sampleUrl: action.payload.sampleSecureUrl,
        youTubeUrl: null,
        played: 0,
        loaded: 0,
        playing: true,
        loadedTrack: action.payload,
      }
    case PLAY_PAUSE:
      return {
        ...state,
        playing: !state.playing
      }
    case PLAY:
      return {
        ...state,
        playing: true
      }
    case PAUSE:
      return {
        ...state,
        playing: false
      }
    case SEEK_MOUSE_DOWN:
      return {
        ...state,
        seeking: true
      }
    case SEEK_CHANGE:
      return {
        ...state,
        played: action.payload
      }
    case SEEK_MOUSE_UP:
      return {
        ...state,
        seeking: false
      }
    case UPDATE_TRACK_PROGRESS:
      return state.seeking ? state : Object.assign({}, { ...state }, action.payload);
    case SET_DURATION:
      return {
        ...state,
        duration: action.payload
      }
    case TOGGLE_MUTE:
      return {
        ...state,
        muted: !state.muted
      }
    case SET_VOLUME:
      return {
        ...state,
        volume: action.payload
      }
    case GET_YOUTUBE_LINK:
      // TODO: This needs a lot of work. Rather than just pull the first result,
      // we should have some logic to determine best fit. e.g.: yt length matches bp's stated length, etc.
      // should also handle null values
      const youTubeId = action.payload.data[0].id.videoId;
      
      if(!youTubeId) return state;

      const youTubeUrl = `http://youtube.com/watch?v=${youTubeId}`;
      return {
        ...state,
        loadedUrl: youTubeUrl,
        youTubeUrl,
        played: 0,
        loaded: 0,
        playing: true,
      }
    default:
      return state;
  }
}

export default mediaPlayer;