import axios from 'axios';

import { API_GET_LABEL_BY_ID, API_MOST_POPULAR_BY_LABEL, API_MOST_POPULAR_RELEASES_BY_LABEL } from '../constants/apiPaths';
import { START_ASYNC, GET_LABEL_DETAIL, LOAD_TRACKS } from '../constants/actionTypes';

export const getLabelDetail = labelId => {
  return async dispatch => {
    dispatch({
      type: START_ASYNC
    });

    const labelData = await axios.get(`${API_GET_LABEL_BY_ID}?id=${labelId}`);
    const labelTracks = await axios.get(`${API_MOST_POPULAR_BY_LABEL}?id=${labelId}&perPage=25`);
    const labelReleases = await axios.get(`${API_MOST_POPULAR_RELEASES_BY_LABEL}?id=${labelId}`);

    const { data } = labelData;
    let labelDataPayload = {};

    if (data.results.length > 0) {
      labelDataPayload = data.results[0];
    }

    const tracksData = labelTracks.data.results;
    const releasesData = labelReleases.data.results;

    dispatch({
      type: LOAD_TRACKS,
      payload: tracksData,
    })

    dispatch({
      type: GET_LABEL_DETAIL,
      payload: {
        labelData: labelDataPayload,
        releasesData,
      }
    });
  }
}
