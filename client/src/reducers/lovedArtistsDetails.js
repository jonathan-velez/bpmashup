import _ from 'lodash';
import { LOAD_LOVED_ARTISTS_DETAILS, CLEAR_LOVED_ARTISTS_DETAILS } from '../constants/actionTypes';

const lovedArtistsDetails = (state = [], action) => {

  switch (action.type) {
    case LOAD_LOVED_ARTISTS_DETAILS: {
      if (!_.has(action.payload.data, 'metadata') || !_.has(action.payload.data, 'results')) {
        return [];
      }

      const { metadata, results } = action.payload.data;

      // extract id as the key, convert array to object
      const keyedArtists = _.mapKeys(results, 'id');

      return {
        metadata,
        artists: keyedArtists
      }
    }
    case CLEAR_LOVED_ARTISTS_DETAILS: {
      return [];
    }
    default:
      return state;
  }
}

export default lovedArtistsDetails;
