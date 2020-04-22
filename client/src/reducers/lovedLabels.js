import {
  TOGGLE_LOVE_LABEL,
  LOAD_LOVED_LABELS,
  CLEAR_LOVED_LABELS,
} from '../constants/actionTypes';

const defaultState = {};
const lovedLabels = (state = defaultState, action) => {
  switch (action.type) {
    case TOGGLE_LOVE_LABEL: {
      if (!action.payload) {
        return state;
      }

      const { id, add } = action.payload;

      if (add) {
        return [...state, id];
      }

      return state.filter((tId) => tId !== id);
    }
    case LOAD_LOVED_LABELS: {
      return action.payload;
    }
    case CLEAR_LOVED_LABELS: {
      return defaultState;
    }
    default:
      return state;
  }
};

export default lovedLabels;
