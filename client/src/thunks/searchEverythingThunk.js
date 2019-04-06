import { callAPIorCache } from '../seessionStorageCache';
import { SEARCH_EVERYTHING, LOAD_TRACKS } from '../constants/actionTypes';
import { API_SEARCH_EVERYTHING } from '../constants/apiPaths';

export const searchEverything = searchBy => {
  return async (dispatch) => {
    // parse search results and group by type. load tracks into trackListing reducer
    const searchResponse = await callAPIorCache(`${API_SEARCH_EVERYTHING}?query=${searchBy}&perPage=50`);

    const { data } = searchResponse;
    const { results } = data;

    const artists = [];
    const tracks = [];
    const labels = [];
    const releases = [];

    if (results) {
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
            break;
        }
      })
    }

    const payloadAll = {
      artists,
      tracks,
      labels,
      releases,
    }

    dispatch({
      type: SEARCH_EVERYTHING,
      payload: payloadAll,
    })

    if (tracks.length > 0) {
      dispatch({
        type: LOAD_TRACKS,
        payload: tracks,
      })
    }
  }
}
