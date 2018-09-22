import { TOGGLE_LOVE_TRACK, LOAD_LOVED_TRACKS } from '../constants/actionTypes';

const defaultState = {
  tracks: [],
  artists: [],
  labels: [],
}

const lovedTracks = (state = defaultState, action) => {
  switch (action.type) {
    case TOGGLE_LOVE_TRACK:
      if (!action.payload) {
        return state;
      }

      let { type, trackId, add } = action.payload;

      type = type + 's';

      if (add) {
        // return [...state, trackId];
        console.log(type, trackId, add, state, state[type])
        return {
          ...state,
          [type]: [...state[type], trackId],
        }
      }

      // return state.filter(tId => tId !== trackId);
      return {
        ...state,
        [type]: state[type].filter(tId => tId !== trackId),
      }
    case LOAD_LOVED_TRACKS:
      const { payload: newTracks = [] } = action;

      return {
        ...state,
        [type]: [...new Set(state.concat(newTracks))]
      }
      // return [...new Set(state.concat(newTracks))];
    default:
      return state;
  }
}

export default lovedTracks;
