import queryString from 'query-string';
import _ from 'lodash';
import moment from 'moment';

import {
  START_ASYNC,
  GET_TRACKS,
  FETCH_TRACKS,
  SEARCH_TRACKS,
  GET_YOUTUBE_LINK,
  CLEAR_TRACKLIST,
} from '../constants/actionTypes';
import {
  API_MY_BEATPORT,
  API_MOST_POPULAR,
  API_GET_TRACKS,
  API_SIMILAR_TRACKS,
  API_GET_YOUTUBE_LINK,
} from '../constants/apiPaths';
import { DEFAULT_PAGE } from '../constants/defaults';
import { callAPIorCache } from '../seessionStorageCache';
import { getPerPageSetting } from '../utils/helpers';

export const getTracks = async (searchFacets) => {
  return async (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });

    const facetsModel = {
      key_id: null,
      genre_id: null,
      artistId: null,
      labelId: null,
      bpm: null,
    };

    const facetsParams =
      !_.isEmpty(searchFacets) &&
      Object.keys(facetsModel).reduce((obj, key) => {
        if (searchFacets[key]) {
          obj[key] = searchFacets[key];
        }
        return obj;
      }, {});

    const pageModel = {
      page: DEFAULT_PAGE,
      per_page: getPerPageSetting(),
      publish_date: null,
    };

    const pageParams = queryString.stringify(
      Object.keys(pageModel).reduce((obj, key) => {
        obj[key] = !searchFacets[key] ? pageModel[key] : searchFacets[key];
        return obj;
      }, {}),
    );

    const tracksRequest = await callAPIorCache(
      `${API_GET_TRACKS}?${pageParams}${facetsParams ? '&' + queryString.stringify(facetsParams) : ''
      }`,
    );

    dispatch({
      type: FETCH_TRACKS,
      payload: tracksRequest,
    });

    dispatch({
      type: GET_TRACKS,
    });
  };
};

export const fetchMostPopularTracks = async (
  type,
  id,
  name,
  page = DEFAULT_PAGE,
  per_page = getPerPageSetting(),
) => {
  return async (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });

    let urlString = API_MOST_POPULAR + '?';

    switch (type) {
      case 'genre':
        urlString = `/api/genres/${id || 1}/top/100/?`;
        break;
      case 'artist':
        urlString += `artist_id=${id}`;
        break;
      case 'label':
        urlString += `label_id=${id}`;
        break;
      case 'key':
        urlString += `key_id=${id}`;
        break;
      default:
    }

    urlString += `&page=${page}&per_page=${per_page}`;

    const requestResult = await callAPIorCache(
      urlString,
    );

    dispatch({
      type: FETCH_TRACKS,
      payload: requestResult,
    });
  };
};

export const getTracksByIds = async (
  ids = [],
  page = DEFAULT_PAGE,
  per_page = getPerPageSetting(),
) => {
  return async (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });

    const requestResult = await callAPIorCache(
      `${API_GET_TRACKS}?ids=${Array.isArray(ids) ? ids.join(',') : ids
      }&page=${page}&per_page=${per_page}`,
    );

    dispatch({
      type: FETCH_TRACKS,
      payload: requestResult,
    });
  };
};

export const getLatestTracksByLabelAndArtistIds = async (
  labelIds = [],
  artistIds = [],
  page = DEFAULT_PAGE,
  per_page = getPerPageSetting(),
) => {
  return async (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });

    const requestResult = await callAPIorCache(
      `${API_MY_BEATPORT}?artistIds=${Array.isArray(artistIds) ? artistIds.join(',') : artistIds
      }&labelIds=${Array.isArray(labelIds) ? labelIds.join(',') : labelIds
      }&page=${page}&per_page=${per_page}&sortBy=publishDate+DESC&publishDateStart=${moment()
        .subtract(30, 'days')
        .format('YYYY-MM-DD')}&publishDateEnd=${moment().format('YYYY-MM-DD')}`,
    );

    dispatch({
      type: FETCH_TRACKS,
      payload: requestResult,
    });
  };
};

export const fetchTracksSimilar = async (trackId, page = 1, per_page = 20) => {
  return async (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });

    const request = await callAPIorCache(
      `${API_SIMILAR_TRACKS}?id=${trackId}&per_page=${per_page}&page=${page}`,
    );

    dispatch({
      type: SEARCH_TRACKS,
      payload: request,
    });
  };
};

export const getYoutubeLink = async (searchString, lengthMs) => {
  return async (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });

    const request = await callAPIorCache(
      `${API_GET_YOUTUBE_LINK}?q=${encodeURIComponent(
        searchString,
      )}&lengthMs=${lengthMs}`,
    );

    dispatch({
      type: GET_YOUTUBE_LINK,
      payload: request.data,
    });
  };
};

export const clearTracklist = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_TRACKLIST,
    });
  };
};
