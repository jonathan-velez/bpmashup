import { FETCH_CHARTS, CLEAR_CHARTS } from '../constants/actionTypes';

const defaultState = [];

const chartsList = (state = defaultState, action) => {
  const { payload = {}, type } = action;
  const { results = [] } = payload;

  switch (type) {
    case FETCH_CHARTS: {
      return [...state, ...results];
    }
    case CLEAR_CHARTS: {
      return defaultState;
    }
    default:
      return state;
  }
};

export default chartsList;
