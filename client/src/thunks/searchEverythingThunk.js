import { SEARCH_EVERYTHING } from '../constants/actionTypes';
import axios from 'axios';

export const searchEverything = searchBy => {
  return (dispatch, getState) => {

    const payload = axios.get(`/api/search?query=${searchBy}&perPage=50`);

    dispatch({
      type: SEARCH_EVERYTHING,
      payload
    })
  }
}
