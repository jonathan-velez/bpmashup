import { TOGGLE_LOVE_ARTIST, LOAD_LOVED_ARTISTS } from '../constants/actionTypes';

const lovedArtists = (state = [], action) => {
  switch (action.type) {
    case TOGGLE_LOVE_ARTIST:
      if (!action.payload) {
        return state;
      }

      const { id, add } = action.payload;

      if (add) {
        return [...state, id];
      }

      return state.filter(tId => tId !== id);
    case LOAD_LOVED_ARTISTS:
      const { payload: newTracks = [] } = action;
      return [...new Set(state.concat(newTracks))];
    default:
      return state;
  }
}

export default lovedArtists;
