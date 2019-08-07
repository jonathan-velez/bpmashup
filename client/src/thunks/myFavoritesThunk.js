import { API_GET_LOVED_LABELS, API_GET_LOVED_ARTISTS } from '../constants/apiPaths';
import { LOAD_LOVED_LABELS_DETAILS } from '../constants/actionTypes';
import { callAPIorCache } from '../seessionStorageCache';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '../constants/defaults';

export const getMyFavoriteLabels = (labels) => {
  return (dispatch) => {
    const labelsString = labels.join(',');

    const payload = callAPIorCache(`${API_GET_LOVED_LABELS}?ids=${labelsString}&perPage=25&sortBy=publishDate DESC`);

    dispatch({
      type: LOAD_LOVED_LABELS_DETAILS,
      payload
    });
  }
}

export const getMyFavoriteArtists = (artists) => {
  return (dispatch) => {
    const artistsString = artists.join(',');

    const payload = callAPIorCache(`${API_GET_LOVED_ARTISTS}?ids=${artistsString}&perPage=25&sortBy=publishDate DESC`);
    dispatch({
      type: 'LOAD_LOVED_ARTISTS_DETAILS',
      payload
    })
  }
}

export const getLabelsById = async (ids, page = DEFAULT_PAGE, perPage = DEFAULT_PER_PAGE) => {

  return (dispatch) => {
    const payload = callAPIorCache(`${API_GET_LOVED_LABELS}?ids=${ids}&page=${page}&perPage=${perPage}&sortBy=publishDate+DESC`);

    dispatch({
      type: LOAD_LOVED_LABELS_DETAILS,
      payload
    });
  }
}
