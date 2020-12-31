import { TOGGLE_LOVE_CHART, LOAD_LOVED_CHARTS } from '../constants/actionTypes';

const defaulState = {};

const lovedCharts = (state = defaulState, action) => {
  const { type, payload } = action;

  switch (type) {
    case TOGGLE_LOVE_CHART: {
      if (!payload) return state;
      const { id, add } = payload;

      if (add) {
        return [...state, id];
      }

      return state.filter((tId) => tId !== id);
    }
    case LOAD_LOVED_CHARTS: {
      return payload;
    }
    default:
      return state;
  }
};

export default lovedCharts;
