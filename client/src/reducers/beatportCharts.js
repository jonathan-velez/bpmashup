import { FETCH_BEATPORT_CHARTS } from '../constants/actionTypes';

const defaultState = {
  metadata: {
    charts: {},
  },
  results: {
    charts: [],
  },
};

const beatportCharts = (state = defaultState, action) => {
  const { payload, type } = action;

  switch (type) {
    case FETCH_BEATPORT_CHARTS:
      return payload;
    default:
      return state;
  }
};

export default beatportCharts;
