import { GET_ARTIST_DETAIL } from '../constants/actionTypes';

const defaultState = {
  artistData: {},
  eventsData: [],
};

const artistDetail = (state = defaultState, action) => {
  switch (action.type) {
    case GET_ARTIST_DETAIL: {
      const { artistData, eventsData } = action.payload;

      return {
        ...state,
        artistData,
        eventsData,
      }
    }
    default:
      return state;
  }
}

export default artistDetail;
