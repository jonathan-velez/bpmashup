import { TOGGLE_LOVE_TRACK, LOAD_LOVED_TRACKS } from '../constants/actionTypes';

const lovedTracks = (state = [], action) => {
  switch (action.type) {
    case TOGGLE_LOVE_TRACK: {
      if (!action.payload) {
        return state;
      }

      const { id, add } = action.payload;

      if (add) {
        return [...state, id];
      }

      return state.filter(tId => tId !== id);
    }
    case LOAD_LOVED_TRACKS: {
      const { payload: newTracks = [] } = action;
      return [...new Set(state.concat(newTracks))];
    }
    default:
      return state;
  }
}

export default lovedTracks;
