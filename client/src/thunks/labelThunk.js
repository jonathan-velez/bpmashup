import { callAPIorCache } from '../seessionStorageCache';
import { API_GET_LABEL_BY_ID } from '../constants/apiPaths';
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

    const labelDataCall = callAPIorCache(`${API_GET_LABEL_BY_ID}?id=${labelId}&name=${labelName}`);
    const labelTracksCall = callAPIorCache(`${API_GET_LABEL_BY_ID}/${labelId}/top/100/?per_page=${DEFAULT_PER_PAGE}`);
    const labelReleasesCall = callAPIorCache(`${API_GET_LABEL_BY_ID}/${labelId}/releases`);

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
