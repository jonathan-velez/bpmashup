import {
  LOAD_PLAYLIST_DETAILS,
  CLEAR_PLAYLIST_DETAILS,
} from '../constants/actionTypes';

const defaultState = {};
const playlistDetails = (state = defaultState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOAD_PLAYLIST_DETAILS: {
      return payload;
    }
    case CLEAR_PLAYLIST_DETAILS: {
      return defaultState;
    }
    default:
      return state;
  }
};

export default playlistDetails;
