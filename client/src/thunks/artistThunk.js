import Axios from 'axios';

import { API_GET_ARTIST_DETAIL, API_GET_ARTIST_EVENTS_BY_NAME } from '../constants/apiPaths';
import { START_ASYNC, GET_ARTIST_DETAIL, LOAD_TRACKS, GET_ARTIST_EVENTS_BY_NAME } from '../constants/actionTypes';

export const getArtistThunk = artistId => {
  return dispatch => {
    dispatch({
      type: START_ASYNC
    });

    const request = Axios.get(`${API_GET_ARTIST_DETAIL}?id=${artistId}`);

    request.then(response => {
      const { data } = response;
      const { results } = data;
      const { topDownloads } = results;

      dispatch({
        type: LOAD_TRACKS,
        payload: topDownloads,
      });
    });

    dispatch({
      type: GET_ARTIST_DETAIL,
      payload: request,
    });
  }
}

export const getArtistEvents = artistName => {
  return dispatch => {
    dispatch({
      type: START_ASYNC
    });
    
    const request = Axios.get(`${API_GET_ARTIST_EVENTS_BY_NAME}?artistName=${artistName}`);

    dispatch({
      type: GET_ARTIST_EVENTS_BY_NAME,
      payload: request,
    });
  }
}
