import { callAPIorCache } from '../seessionStorageCache';
import {
  SEARCH_TRACKS,
  SEARCH_EVERYTHING,
  LOAD_TRACKS,
  START_ASYNC,
} from '../constants/actionTypes';
import { API_SEARCH_EVERYTHING, API_SEARCH } from '../constants/apiPaths';

export const searchTracks = async (searchTerm, page = 1, per_page = 20) => {
  return async (dispatch) => {
    const request = await callAPIorCache(
      `${API_SEARCH}?q=${searchTerm}&facets=fieldType:track&sortBy=publishDate+DESC&per_page=${per_page}&page=${page}`,
    );

    dispatch({
      type: START_ASYNC,
    });

    dispatch({
      type: SEARCH_TRACKS,
      payload: request,
    });
  };
};

export const searchEverything = (searchBy) => {
  return async (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });

    // parse search results and group by type. load tracks into trackListing reducer
    const searchResponse = await callAPIorCache(
      `${API_SEARCH_EVERYTHING}?q=${searchBy}&per_page=50`,
    );

    const { data: payload } = searchResponse;

    dispatch({
      type: SEARCH_EVERYTHING,
      payload,
    });

    if (payload.tracks && payload.tracks.length > 0) {
      dispatch({
        type: LOAD_TRACKS,
        payload: payload.tracks,
      });
    }
  };
};
