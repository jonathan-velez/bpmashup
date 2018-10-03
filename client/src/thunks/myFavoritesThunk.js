import { API_GET_LOVED_LABELS } from '../constants/apiPaths';
import { LOAD_LOVED_LABELS_DETAILS } from '../constants/actionTypes';
import axios from 'axios';

export const getMyFavoriteLabels = (labels) => {
  return (dispatch, getState) => {
    const { lovedLabels } = getState();
    const labelsString = labels.join(',');

    const payload = axios.get(`${API_GET_LOVED_LABELS}?ids=${labelsString}`);

    dispatch({
      type: LOAD_LOVED_LABELS_DETAILS,
      payload
    });
  }
}
