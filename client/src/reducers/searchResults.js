import { SEARCH_EVERYTHING } from '../constants/actionTypes';

const defaultState = {
  artists: [],
  tracks: [],
  labels: [],
  releases: [],
}

const searchResults = (state = defaultState, action) => {
  switch (action.type) {
    case SEARCH_EVERYTHING:
      const { artists, tracks, labels, releases } = action.payload;
      return {
        ...state,
        artists,
        tracks,
        labels,
        releases,
      }
    default:
      return state;
  }
}

export default searchResults;
