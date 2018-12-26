import { SEARCH_EVERYTHING } from '../constants/actionTypes';
import { API_SEARCH_EVERYTHING } from '../constants/apiPaths';
import axios from 'axios';

export const searchEverything = searchBy => {
  return (dispatch, getState) => {

    const payload = axios.get(`${API_SEARCH_EVERYTHING}?query=${searchBy}&perPage=50`);

    dispatch({
      type: SEARCH_EVERYTHING,
      payload
    })
  }
}
