import { GET_ARTIST_DETAIL, GET_ARTIST_EVENTS_BY_NAME } from '../constants/actionTypes';

const defaultState = {
  artistData: {},
  events: [],
};

const artistDetail = (state = defaultState, action) => {
  switch (action.type) {
    case GET_ARTIST_DETAIL:
      const { data } = action.payload;
      const { results: artistData } = data;

      return {
        ...state,
        artistData
      };
    case GET_ARTIST_EVENTS_BY_NAME:
      const { data: eventData } = action.payload;
      const { events } = eventData;

      return {
        ...state,
        events
      };
    default:
      return state;
  }
}

export default artistDetail;
