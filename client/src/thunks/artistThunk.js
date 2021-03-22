import { callAPIorCache } from '../seessionStorageCache';
import {
  API_GET_ARTIST_DETAIL,
  API_GET_ARTIST_EVENTS_BY_NAME,
} from '../constants/apiPaths';
import {
  START_ASYNC,
  GET_ARTIST_DETAIL,
  GENERAL_ERROR,
  FETCH_TRACKS,
} from '../constants/actionTypes';
import { DEFAULT_PER_PAGE } from '../constants/defaults';

export const getArtistDetails = ({ artistId, artistName }) => {
  return async (dispatch) => {
    function successfulCall({
      artistDetails,
      artistEvents,
      artistMostPopularTracks,
    }) {
      const { data: artistData } = artistDetails;
      const { data: eventsData } = artistEvents;

      dispatch({
        type: FETCH_TRACKS,
        payload: artistMostPopularTracks,
      });

      // dispatch combined artist data to state
      dispatch({
        type: GET_ARTIST_DETAIL,
        payload: {
          artistData: artistData.data,
          eventsData: eventsData.events,
        },
      });
    }

    function failedCall(error) {
      dispatch({
        type: GENERAL_ERROR,
        error,
      });
    }

    dispatch({
      type: START_ASYNC,
    });

    try {
      const artistDetailsCall = callAPIorCache(
        `${API_GET_ARTIST_DETAIL}?id=${artistId}`,
      );
      const artistEventsCall = callAPIorCache(
        `${API_GET_ARTIST_EVENTS_BY_NAME}?artistName=${artistName}`,
      );

      const artistsMostPopularTracks = callAPIorCache(
        // `${API_MOST_POPULAR_BY_ARTISTS}?id=${artistId}&per_page=${DEFAULT_PER_PAGE}`,
        `/api/artists/${artistId}/top/${DEFAULT_PER_PAGE}/`,
      );

      successfulCall({
        artistDetails: await artistDetailsCall,
        artistEvents: await artistEventsCall,
        artistMostPopularTracks: await artistsMostPopularTracks,
      });
    } catch (error) {
      failedCall(error);
    }
  };
};
