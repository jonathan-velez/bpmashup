import _ from 'lodash';
import { FETCH_TRACKS, SEARCH_TRACKS, LOAD_TRACKS, TOGGLE_TRACKLIST_VIEW, CLEAR_TRACKLIST } from '../constants/actionTypes';

const defaultState = {
  metadata: {},
  tracks: {},
  tracklistView: 'cards',
}

const trackListing = (state = defaultState, action) => {
  switch (action.type) {
    case SEARCH_TRACKS:
    case FETCH_TRACKS: {
      if (!_.has(action.payload.data, 'metadata') || !_.has(action.payload.data, 'results')) {
        return defaultState;
      }

      const { metadata, results } = action.payload.data;

      // extract id as the key, convert array to object
      const keyedTracks = _.mapKeys(results, 'id');

      return {
        ...state,
        metadata,
        tracks: keyedTracks
      }
    }
    case LOAD_TRACKS: {
      // since we are overriding the tracks in the tracklisting, we need to also update the metadata props that are pulled from the bp api
      const { payload: tracks = [] } = action;
      const totalPages = Math.ceil(tracks.length / 25);

      return {
        ...state,
        metadata: {
          pageType: 'playlist',
          perPage: 25,
          page: 1,
          totalPages
        },
        tracks
      }
    }
    case TOGGLE_TRACKLIST_VIEW: {
      const tracklistView = action.payload === 'table' ? 'table' : 'cards';

      return {
        ...state,
        tracklistView,
      }
    }
    case CLEAR_TRACKLIST: {
      return {
        ...defaultState
      }
    }
    default:
      return state;
  }
};

export default trackListing;
