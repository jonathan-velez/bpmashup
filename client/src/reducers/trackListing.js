import _ from 'lodash';
import { FETCH_TRACKS, SEARCH_TRACKS, LOAD_TRACKS } from '../constants/actionTypes';

const defaultState = {
  metadata: {},
  tracks: {}
}

const trackListing = (state = defaultState, action) => {
  switch (action.type) {
    case SEARCH_TRACKS:
    case FETCH_TRACKS:
      const { metadata, results } = action.payload.data;
      // extract id as the key, convert array to object
      const keyedTracks = _.mapKeys(results, 'id');

      return {
        metadata,        
        tracks: keyedTracks
      }
    case LOAD_TRACKS:
      // since we are overriding the tracks in the tracklisting, we need to also update the metadata props that are pulled from the bp api
      const tracks = action.payload;
      return {
        ...state,
        metadata: {
          ...state.metadata,
          perPage: 20,
          totalPages: Math.ceil(Object.keys(tracks).length / 20)
        },
        tracks
      }
    default:
      return state;
  }
};

export default trackListing;