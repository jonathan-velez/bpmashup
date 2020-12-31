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
  API_GET_TRACKS,
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
  perPage = DEFAULT_PER_PAGE,
) {
  return async (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });

    // hard code the page and perPage on the metadata call as it will always be the first result
    // we'll benefit from the cached api call when page + perPage changes come on the tracks call below
    const chartsMetadata = await callAPIorCache(
      `${API_GET_CHART}?id=${chartId}&page=1&perPage=25`,
    );
    const chartObject =
      (chartsMetadata.data.results &&
        Array.isArray(chartsMetadata.data.results) &&
        chartsMetadata.data.results[0]) ||
      {};

    const chartTracks = await callAPIorCache(
      `${API_GET_TRACKS}?chartId=${chartId}&page=${page}&perPage=${perPage}`,
    );

    dispatch({
      type: GET_CHART_DATA,
      payload: chartObject,
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
  perPage = DEFAULT_CHARTS_PER_PAGE,
) {
  return async (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });

    const chartData = await callAPIorCache(
      `${API_GET_CHART}?ids=${chartIds.join(',')}&page=${page}&perPage=${perPage}`,
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
  perPage = DEFAULT_CHARTS_PER_PAGE,
) {
  return async (dispatch) => {
    if (!profileId) return;

    dispatch({
      type: START_ASYNC,
    });

    const beatportChardData = await callAPIorCache(
      `${API_GET_CHARTS_BY_PROFILE_ID}?djprofileId=${profileId}&publishedOnly=true&page=${page}&perPage=${perPage}&sortBy=publishDate+DESC`,
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
  perPage = DEFAULT_CHARTS_PER_PAGE,
) {
  return async (dispatch) => {
    if (!genreId) return;

    dispatch({
      type: START_ASYNC,
    });

    const beatportChardData = await callAPIorCache(
      `${API_GET_CHART}?facets=genreId:${genreId}&publishedOnly=true&page=${page}&perPage=${perPage}&sortBy=publishDate+DESC`,
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
