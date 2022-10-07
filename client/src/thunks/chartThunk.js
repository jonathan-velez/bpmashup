import { callAPIorCache } from '../seessionStorageCache';
import {
  GET_CHART_DATA,
  FETCH_TRACKS,
  START_ASYNC,
  FETCH_CHARTS,
  FETCH_CHARTS_BY_PROFILE_ID,
  FETCH_CHARTS_BY_GENRE_ID,
  CLEAR_CHARTS,
} from '../constants/actionTypes';
import {
  API_GET_CHART,
  API_GET_CHARTS_BY_PROFILE_ID,
} from '../constants/apiPaths';
import {
  DEFAULT_CHARTS_PER_PAGE,
  DEFAULT_PAGE,
  DEFAULT_PER_PAGE,
} from '../constants/defaults';

// For a given chartId, fetch its metadata and then fetch the tracks within it
// Requires two separate BP API calls
export async function fetchChartDataById(
  chartId,
  page = DEFAULT_PAGE,
  per_page = DEFAULT_PER_PAGE,
) {
  return async (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });

    const chartsMetadata = await callAPIorCache(
      `${API_GET_CHART}/${chartId}`,
    );

    const chartTracks = await callAPIorCache(
      `${API_GET_CHART}/${chartId}/tracks?page=${page}&per_page=${per_page}`,
    );

    dispatch({
      type: GET_CHART_DATA,
      payload: chartsMetadata && chartsMetadata.data,
    });

    dispatch({
      type: FETCH_TRACKS,
      payload: chartTracks,
    });
  };
}

export async function fetchChartsByIds(
  chartIds = [],
  page = DEFAULT_PAGE,
  per_page = DEFAULT_CHARTS_PER_PAGE,
) {
  return async (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });

    const chartData = await callAPIorCache(
      `${API_GET_CHART}?ids=${chartIds.join(
        ',',
      )}&page=${page}&per_page=${per_page}`,
    );
    const { data, status } = chartData;
    if (status !== 200) return;

    dispatch({
      type: FETCH_CHARTS,
      payload: data,
    });
  };
}

export async function fetchChartsByProfileId(
  profileId,
  page = DEFAULT_PAGE,
  per_page = DEFAULT_CHARTS_PER_PAGE,
) {
  return async (dispatch) => {
    if (!profileId) return;

    dispatch({
      type: START_ASYNC,
    });

    const beatportChardData = await callAPIorCache(
      `${API_GET_CHARTS_BY_PROFILE_ID}?djprofileId=${profileId}&publishedOnly=true&page=${page}&per_page=${per_page}&sortBy=publishDate+DESC`,
    );

    const { data, status } = beatportChardData;
    if (status !== 200) return;

    dispatch({
      type: FETCH_CHARTS_BY_PROFILE_ID,
      payload: data,
    });
  };
}

export async function fetchChartsByGenreId(
  genreId,
  page = DEFAULT_PAGE,
  per_page = DEFAULT_CHARTS_PER_PAGE,
) {
  return async (dispatch) => {
    if (!genreId) return;

    dispatch({
      type: START_ASYNC,
    });

    const beatportChardData = await callAPIorCache(
      `${API_GET_CHART}?genre_id=${genreId}&is_published=true&page=${page}&per_page=${per_page}`,
    );

    const { data, status } = beatportChardData;
    if (status !== 200) return;

    dispatch({
      type: FETCH_CHARTS_BY_GENRE_ID,
      payload: data,
    });
  };
}

export function clearInfiniteCharts() {
  return (dispatch) => {
    dispatch({
      type: CLEAR_CHARTS,
    });
  };
}
