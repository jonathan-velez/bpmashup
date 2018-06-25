import _ from 'lodash';

import { musicalKeyFilter } from '../utils/helpers';
import { FETCH_TRACKS, SEARCH_TRACKS, LOAD_TRACKS } from '../constants/actionTypes';

const defaultState = {
  metadata: {},
  tracks: {}
}

const getListOfKeys = tracks => {
  const uniqueKeysArray = [];
  const uniqueKeys = [...new Set(tracks.map(track => track.key && track.key.shortName))];

  uniqueKeys.forEach(key => {
    const uniqueKeysObject = {};
    uniqueKeysObject.shortName = key;
    uniqueKeysObject.camelotName = key && musicalKeyFilter(key);
    uniqueKeysObject.camelotNameNumber = key && +musicalKeyFilter(key).replace(/\D/g, '');
    uniqueKeysObject.camelotNameLetter = key && musicalKeyFilter(key).replace(/\d+/g, '');

    uniqueKeysArray.push(uniqueKeysObject);
  })

  const sortedFinal = _.orderBy(uniqueKeysArray, [
    (key) => key.camelotNameNumber,
    (key) => key.camelotNameLetter,
  ]);

  return sortedFinal;
}

const getListOfLabels = tracks => {
  return tracks && [...new Set(tracks.map(track => track.label && track.label.name))].sort();
}

const trackListing = (state = defaultState, action) => {
  switch (action.type) {
    case SEARCH_TRACKS:
    case FETCH_TRACKS:
      if (!_.has(action.payload.data, 'metadata') || !_.has(action.payload.data, 'results')) {
        return defaultState;
      }

      const { metadata, results } = action.payload.data;

      // extract id as the key, convert array to object
      const keyedTracks = _.mapKeys(results, 'id');

      return {
        metadata,
        tracks: keyedTracks,
        listOfKeys: getListOfKeys(results),
        listOfLabels: getListOfLabels(results),
      }
    case LOAD_TRACKS:
      // since we are overriding the tracks in the tracklisting, we need to also update the metadata props that are pulled from the bp api
      const { payload: tracks = [] } = action;
      const totalPages = Math.ceil(Object.keys(tracks).length / 20);

      return {
        ...state,
        metadata: {
          pageType: 'playlist',
          perPage: 20,
          page: 1,
          totalPages
        },
        tracks
      }
    case 'FILTER_TRACKLIST':
      const filteredTracks = action.payload;
      return {
        ...state,
        filteredTracks: filteredTracks,
      }
    default:
      return state;
  }
};

export default trackListing;
