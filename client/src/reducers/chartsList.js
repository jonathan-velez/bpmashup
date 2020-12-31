import {
  FETCH_CHARTS_BY_PROFILE_ID,
  FETCH_CHARTS_BY_GENRE_ID,
  FETCH_CHARTS,
} from '../constants/actionTypes';

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
    case FETCH_CHARTS:
    case FETCH_CHARTS_BY_GENRE_ID: {
      const { metadata = {}, results = [] } = payload;

      return {
        metadata: {
          charts: metadata,
        },
        results: {
          charts: results,
        },
      };
    }
    default:
      return state;
  }
};

export default chartsList;
