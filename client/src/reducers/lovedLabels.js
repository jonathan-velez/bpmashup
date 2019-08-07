import { TOGGLE_LOVE_LABEL, LOAD_LOVED_LABELS } from '../constants/actionTypes';

const lovedLabels = (state = [], action) => {
  switch (action.type) {
    case TOGGLE_LOVE_LABEL: {
      if (!action.payload) {
        return state;
      }

      const { id, add } = action.payload;

      if (add) {
        return [...state, id];
      }

      return state.filter(tId => tId !== id);
    }
    case LOAD_LOVED_LABELS: {
      const { payload: newTracks = [] } = action;
      return [...new Set(state.concat(newTracks))];
    }
    default:
      return state;
  }
}

export default lovedLabels;
