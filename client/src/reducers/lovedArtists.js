import { TOGGLE_LOVE_ARTIST, LOAD_LOVED_ARTISTS, CLEAR_LOVED_ARTISTS } from '../constants/actionTypes';

const defaultState = {};
const lovedArtists = (state = defaultState, action) => {
  switch (action.type) {
    case TOGGLE_LOVE_ARTIST: {
     return state;
    }
    case LOAD_LOVED_ARTISTS: {
      return action.payload;
    }
    case CLEAR_LOVED_ARTISTS: {
      return defaultState;
    }
    default:
      return state;
  }
};

export default lovedArtists;
