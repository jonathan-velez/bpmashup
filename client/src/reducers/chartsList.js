import { FETCH_CHARTS_BY_PROFILE_ID } from '../constants/actionTypes';

const defaultState = {
  metadata: {
    charts: {},
  },
  results: {
    charts: [],
  },
};

const chartsList = (state = defaultState, action) => {
  const { payload, type } = action;

  switch (type) {
    case FETCH_CHARTS_BY_PROFILE_ID:
      return payload;
    default:
      return state;
  }
};

export default chartsList;
