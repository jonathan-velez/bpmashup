import {
  TOGGLE_LOVE_TRACK,
  LOAD_LOVED_TRACKS,
  CLEAR_LOVED_TRACKS,
} from '../constants/actionTypes';

const defaultState = {};
const lovedTracks = (state = defaultState, action) => {
  switch (action.type) {
    case TOGGLE_LOVE_TRACK:
      return state;
    case LOAD_LOVED_TRACKS: {
      return action.payload;
    }
    case CLEAR_LOVED_TRACKS: {
      return defaultState;
    }
    default:
      return state;
  }
};

export default lovedTracks;
