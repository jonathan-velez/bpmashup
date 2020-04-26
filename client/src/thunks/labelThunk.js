import { callAPIorCache } from '../seessionStorageCache';
import {
  API_GET_LABEL_BY_ID,
  API_MOST_POPULAR_BY_LABEL,
  API_MOST_POPULAR_RELEASES_BY_LABEL,
} from '../constants/apiPaths';
import {
  START_ASYNC,
  GET_LABEL_DETAIL,
  FETCH_TRACKS,
} from '../constants/actionTypes';
import { DEFAULT_PER_PAGE } from '../constants/defaults';

export const getLabelDetail = (labelId, labelName) => {
  return async (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });

    const labelDataCall = callAPIorCache(
      `${API_GET_LABEL_BY_ID}?id=${labelId}&name=${labelName}`,
    );
    const labelTracksCall = callAPIorCache(
      `${API_MOST_POPULAR_BY_LABEL}?id=${labelId}&perPage=${DEFAULT_PER_PAGE}`,
    );
    const labelReleasesCall = callAPIorCache(
      `${API_MOST_POPULAR_RELEASES_BY_LABEL}?id=${labelId}`,
    );

    const labelData = await labelDataCall;

    const { data } = labelData;
    let labelDataPayload = {};

    if (data.results.length > 0) {
      labelDataPayload = data.results[0];
    }

    const labelTracks = await labelTracksCall;

    const labelReleases = await labelReleasesCall;
    const releasesData = labelReleases.data.results;

    dispatch({
      type: FETCH_TRACKS,
      payload: labelTracks,
    });

    dispatch({
      type: GET_LABEL_DETAIL,
      payload: {
        labelData: labelDataPayload,
        releasesData,
      },
    });
  };
};
