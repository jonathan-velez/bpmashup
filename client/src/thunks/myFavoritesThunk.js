import { API_GET_LOVED_LABELS, API_GET_LOVED_ARTISTS } from '../constants/apiPaths';
import { LOAD_LOVED_LABELS_DETAILS, START_ASYNC } from '../constants/actionTypes';
import { callAPIorCache } from '../seessionStorageCache';
import { DEFAULT_PAGE } from '../constants/defaults';
import { getPerPageSetting } from '../utils/helpers';

export const getMyFavoriteLabels = (labels) => {
  return (dispatch) => {
    const labelsString = labels.join(',');

    dispatch({
      type: START_ASYNC,
    });

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

    dispatch({
      type: START_ASYNC,
    });

    const payload = callAPIorCache(`${API_GET_LOVED_ARTISTS}?ids=${artistsString}&perPage=25&sortBy=publishDate DESC`);
    dispatch({
      type: 'LOAD_LOVED_ARTISTS_DETAILS',
      payload
    })
  }
}

export const getLabelsById = async (ids, page = DEFAULT_PAGE, perPage = getPerPageSetting()) => {
  return (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });
    
    const payload = callAPIorCache(`${API_GET_LOVED_LABELS}?ids=${ids}&page=${page}&perPage=${perPage}&sortBy=publishDate+DESC`);

    dispatch({
      type: LOAD_LOVED_LABELS_DETAILS,
      payload
    });
  }
}
