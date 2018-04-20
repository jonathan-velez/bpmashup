import { FETCH_GENRES } from '../constants/actionTypes';

const genreListing = (state = [] , action) => {
  switch(action.type) {
    case FETCH_GENRES:
      return action.payload.data.results;
    default:
      return state;
  }
}

export default genreListing;