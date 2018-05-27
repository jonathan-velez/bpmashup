import { LOAD_TRACK } from '../constants/actionTypes';

const loadTrackThunk = (track) => {
  return (dispatch, getState) => {
    dispatch({
      type: LOAD_TRACK,
      payload: track
    })
  }
}

export default loadTrackThunk;
