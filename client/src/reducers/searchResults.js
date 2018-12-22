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
      const { payload } = action;
      const { data } = payload;
      const { results } = data;

      const artists = [];
      const tracks = [];
      const labels = [];
      const releases = [];

      results.forEach(result => {
        switch (result.type) {
          case 'artist':
            artists.push(result);
            break;
          case 'track':
            tracks.push(result);
            break;
          case 'label':
            labels.push(result);
            break;
          case 'release':
            releases.push(result);
            break;
          default:
            console.log('other', result);
            break;
        }
      })

      return {
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
