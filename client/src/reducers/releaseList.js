import { FETCH_RELEASES } from '../constants/actionTypes';
import _ from 'lodash';
const defaultState = {
  metadata: {},
  releases: {},
};

const releaseList = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_RELEASES: {
      console.log('payload', payload);
      if (!_.has(payload, 'metadata') || !_.has(payload, 'results')) {
        return defaultState;
      }

      const { metadata, results } = payload;

      // extract id as the key, convert array to object
      const keyedReleases = _.mapKeys(results, 'id');

      return {
        ...state,
        metadata,
        releases: keyedReleases,
      };
    }
    default:
      return state;
  }
};

export default releaseList;
