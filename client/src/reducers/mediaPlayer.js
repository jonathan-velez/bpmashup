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
  playing: true,
  volume: 1.0,
  muted: false,
  played: 0,
  loaded: 0,
  duration: 0,
  playbackRate: 1.0,
  loop: false,
  loadedTrack: {},
  youTubeObject: {},
}

const mediaPlayer = (state = defaultState, action) => {
  switch (action.type) {
    case LOAD_TRACK:
      if (_.isEmpty(action.payload)) return state;

      return {
        ...state,
        loadedUrl: action.payload.sample_url,
        sampleUrl: action.payload.sample_url,
        played: 0,
        loaded: 0,
        playing: true,
        loadedTrack: action.payload,
        youTubeObject: {},
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
    case GET_YOUTUBE_LINK: {
      const { data } = action.payload;
      
      if (!data.etag) {
        return {
          ...state,
          youTubeObject: {}
        }
      }

      const youTubeId = data.id && data.id.videoId;

      if (!youTubeId) {
        return {
          ...state,
          youTubeObject: {}
        }
      }

      const youTubeTitle = data.snippet.title;
      const youTubeImageUrl = data.snippet.thumbnails.default.url;
      const youTubeImageWidth = data.snippet.thumbnails.default.width;
      const youTubeImageHeight = data.snippet.thumbnails.default.height;
      const youTubeDescription = data.snippet.description;

      const youTubeUrl = `https://youtube.com/watch?v=${youTubeId}`;

      const youTubeObject = {
        youTubeId,
        youTubeUrl,
        youTubeTitle,
        youTubeImageUrl,
        youTubeImageWidth,
        youTubeImageHeight,
        youTubeDescription,
      }

      return {
        ...state,
        loadedUrl: youTubeUrl,
        youTubeObject,
        played: 0,
        loaded: 0,
        playing: true,
      }
    }
    default:
      return state;
  }
}

export default mediaPlayer;
