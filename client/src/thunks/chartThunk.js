import { callAPIorCache } from '../seessionStorageCache';
import {
  GET_CHART_DATA,
  FETCH_TRACKS,
  START_ASYNC,
  FETCH_CHART_METADATA,
  FETCH_CHARTS_BY_PROFILE_ID,
  FETCH_CHARTS_BY_GENRE_ID,
} from '../constants/actionTypes';
import {
  API_GET_CHART,
  API_GET_TRACKS,
  API_GET_CHARTS_BY_PROFILE_ID,
} from '../constants/apiPaths';
import {
  DEFAULT_CHARTS_PER_PAGE,
  DEFAULT_PER_PAGE,
} from '../constants/defaults';

// For a given chartId, fetch its metadata and then fetch the tracks within it
// Requires two separate BP API calls
// TODO: check if Chart metadata is already provided, skip first api call if so

export async function fetchChartDataById(chartId) {
  return async (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });

    const chartMetadata = await callAPIorCache(
      `${API_GET_CHART}?id=${chartId}&perPage=${DEFAULT_PER_PAGE}`,
    );
    const chartObject =
      (chartMetadata.data.results &&
        Array.isArray(chartMetadata.data.results) &&
        chartMetadata.data.results[0]) ||
      {};

    const chartTracks = await callAPIorCache(
      `${API_GET_TRACKS}?chartId=${chartId}&perPage=${DEFAULT_PER_PAGE}`,
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

export async function fetchChartMetadataByIds(
  chartIds = [],
  page = 1,
  perPage = DEFAULT_CHARTS_PER_PAGE,
) {
  return async (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });

    const chartData = await callAPIorCache(
      `${API_GET_CHART}?ids=${chartIds.join(
        ',',
      )}&page=${page}&perPage=${perPage}`,
    );
    const { data, status } = chartData;
    if (status !== 200) return;

    dispatch({
      type: FETCH_CHART_METADATA,
      payload: data,
    });
  };
}

export async function fetchChartsByProfileId(
  profileId,
  page = 1,
  perPage = DEFAULT_CHARTS_PER_PAGE,
) {
  return async (dispatch) => {
    if (!profileId) return;

    dispatch({
      type: START_ASYNC,
    });

    const beatportChardData = await callAPIorCache(
      `${API_GET_CHARTS_BY_PROFILE_ID}?djprofileId=${profileId}&publishedOnly=true&page=${page}&perPage=${perPage}`,
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
  page = 1,
  perPage = DEFAULT_CHARTS_PER_PAGE,
) {
  return async (dispatch) => {
    if (!genreId) return;

    dispatch({
      type: START_ASYNC,
    });

    const beatportChardData = await callAPIorCache(
      `${API_GET_CHART}?facets=genreId:${genreId}&publishedOnly=true&page=${page}&perPage=${perPage}`,
    );

    const { data, status } = beatportChardData;
    if (status !== 200) return;

    dispatch({
      type: FETCH_CHARTS_BY_GENRE_ID,
      payload: data,
    });
  };
}
