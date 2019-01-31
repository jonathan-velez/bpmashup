import Axios from 'axios';

import { API_GET_ARTIST_DETAIL, API_GET_ARTIST_EVENTS_BY_NAME } from '../constants/apiPaths';
import { START_ASYNC, LOAD_TRACKS, GET_ARTIST_DETAIL, GENERAL_ERROR } from '../constants/actionTypes';

export const getArtistDetails = ({ artistId, artistName }) => {
  return async dispatch => {
    function successfulCall({ artistDetails, artistEvents }) {
      const { data: artistData } = artistDetails;
      const { data: eventsData } = artistEvents;

      // get top downloads and load into the media player
      const { results = {} } = artistData;
      const { topDownloads = [] } = results;
      dispatch({
        type: LOAD_TRACKS,
        payload: topDownloads,
      });

      // dispatch combined artist data to state
      dispatch({
        type: GET_ARTIST_DETAIL,
        payload: {
          artistData: artistData.results,
          eventsData: eventsData.results,
        }
      })
    }

    function failedCall(error) {
      dispatch({
        type: GENERAL_ERROR,
        error
      })
    }

    dispatch({
      type: START_ASYNC
    });

    try {
      const artistDetails = await Axios.get(`${API_GET_ARTIST_DETAIL}?id=${artistId}`);
      const artistEvents = await Axios.get(`${API_GET_ARTIST_EVENTS_BY_NAME}?artistName=${artistName}`);

      successfulCall({ artistDetails, artistEvents });
    } catch (error) {
      failedCall(error);
    }
  }
}
