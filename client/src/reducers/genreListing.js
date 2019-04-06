import _ from 'lodash';
import { FETCH_GENRES } from '../constants/actionTypes';

const genreListing = (state = [], action) => {
  switch (action.type) {
    case FETCH_GENRES: {
      const results = _.get(action.payload.data, 'results', []);
      return results;
    }
    default:
      return state;
  }
}

export default genreListing;
