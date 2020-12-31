import {
  FETCH_CHARTS,
  FETCH_CHARTS_BY_PROFILE_ID,
  CLEAR_CHARTS,
} from '../constants/actionTypes';

const defaultState = [];

const chartsList = (state = defaultState, action) => {
  const { payload = {}, type } = action;
  const { results = [] } = payload;

  switch (type) {
    case FETCH_CHARTS: {
      return [...state, ...results];
    }
    case FETCH_CHARTS_BY_PROFILE_ID: {
      return [...state, ...(results.charts || [])];
    }
    case CLEAR_CHARTS: {
      return defaultState;
    }
    default:
      return state;
  }
};

export default chartsList;
