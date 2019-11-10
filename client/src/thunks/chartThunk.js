import { callAPIorCache } from '../seessionStorageCache';
import { GET_CHART_DATA, LOAD_TRACKS, START_ASYNC } from '../constants/actionTypes';
import { API_GET_CHART, API_GET_TRACKS } from '../constants/apiPaths';
import { DEFAULT_PER_PAGE } from '../constants/defaults';

// For a given chartId, fetch its metadata and then fetch the tracks within it
// Requires two separate BP API calls
// TODO: check if Chart metadata is already provided, skip first api call if so

export async function fetchChartData(chartId) {
  return async (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });

    const chartMetadata = await callAPIorCache(`${API_GET_CHART}?id=${chartId}&perPage=${DEFAULT_PER_PAGE}`);
    const chartObject = chartMetadata.data.results && Array.isArray(chartMetadata.data.results) && chartMetadata.data.results[0];

    const chartTracks = await callAPIorCache(`${API_GET_TRACKS}?chartId=${chartId}&perPage=${DEFAULT_PER_PAGE}`);
    chartObject.tracks = chartTracks.data && chartTracks.data.results;

    dispatch({
      type: GET_CHART_DATA,
      payload: chartObject,
    });

    dispatch({
      type: LOAD_TRACKS,
      payload: chartObject.tracks,
    });
  }
}
