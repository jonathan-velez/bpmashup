import queryString from 'query-string';
import _ from 'lodash';

import { START_ASYNC, GET_TRACKS, FETCH_TRACKS, SEARCH_TRACKS, GET_YOUTUBE_LINK, CLEAR_TRACKLIST } from '../constants/actionTypes';
import { API_MY_BEATPORT, API_MOST_POPULAR, API_GET_TRACKS, API_SIMILAR_TRACKS, API_GET_YOUTUBE_LINK } from '../constants/apiPaths';
import { DEFAULT_PAGE } from '../constants/defaults';
import { callAPIorCache } from '../seessionStorageCache';
import { getPerPageSetting } from '../utils/helpers';

export const getTracks = async (searchFacets) => {
  return async (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });

    let facetsString = '';
    const facetsModel = {
      key: null,
      genre: null,
      artistId: null,
      labelId: null,
      bpm: null,
    };

    const facetsParams = !_.isEmpty(searchFacets) && Object.keys(facetsModel).reduce((obj, key) => {
      if (searchFacets[key]) {
        obj[key] = searchFacets[key];
      }
      return obj;
    }, {});

    const pageModel = {
      page: DEFAULT_PAGE,
      perPage: getPerPageSetting(),
      publishDateStart: null,
      publishDateEnd: null,
    }

    const pageParams = queryString.stringify(Object.keys(pageModel).reduce((obj, key) => {
      obj[key] = !searchFacets[key] ? pageModel[key] : searchFacets[key];
      return obj;
    }, {}));

    if (facetsParams) {
      const facets = Object.keys(facetsParams);

      for (let i = 0; i < facets.length; i++) {
        const facetName = facets[i];
        facetsString += (i > 0 ? ',' : '') + facetName + ':' + facetsParams[facetName];
      }
    }

    const tracksRequest = await callAPIorCache(`${API_MY_BEATPORT}?${pageParams}${facetsParams ? `&facets=${facetsString}` : ''}`);

    dispatch({
      type: FETCH_TRACKS,
      payload: tracksRequest,
    });

    dispatch({
      type: GET_TRACKS,
    });
  }
}

export const fetchMostPopularTracks = async (type = 'genre', id, name, page = DEFAULT_PAGE, perPage = getPerPageSetting(), endPoint = API_MOST_POPULAR) => {
  return async (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });

    const requestResult = await callAPIorCache(`${endPoint}/${type}?s=${name}&id=${id}&page=${page}&perPage=${perPage}`);

    dispatch({
      type: FETCH_TRACKS,
      payload: requestResult,
    });
  }
}

export const getTracksByIds = async (ids = [], page = DEFAULT_PAGE, perPage = getPerPageSetting()) => {
  return async (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });

    const requestResult = await callAPIorCache(`${API_GET_TRACKS}?ids=${ids.join(',')}&page=${page}&perPage=${perPage}`);

    dispatch({
      type: FETCH_TRACKS,
      payload: requestResult,
    })
  }
}

export const fetchTracksSimilar = async (trackId, page = 1, perPage = 20) => {
  return async (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });

    const request = await callAPIorCache(`${API_SIMILAR_TRACKS}?id=${trackId}&perPage=${perPage}&page=${page}`);

    dispatch({
      type: SEARCH_TRACKS,
      payload: request
    })
  }
}

export const getYoutubeLink = async searchString => {
  return async (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });

    const request = await callAPIorCache(`${API_GET_YOUTUBE_LINK}?q=${encodeURIComponent(searchString)}`);
    dispatch({
      type: GET_YOUTUBE_LINK,
      payload: request
    })
  }
}

export const clearTracklist = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_TRACKLIST,
    })
  }
}
