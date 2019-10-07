import {
  DOWNLOAD_TRACK,
  ADD_TRACK_TO_NO_DOWNLOAD_LIST,
  REMOVE_TRACK_FROM_NO_DOWNLOAD_LIST,
} from '../constants/actionTypes';

export const downloadTrack = payload => {
  return (dispatch, getState) => {
    dispatch({
      type: DOWNLOAD_TRACK,
      payload
    })

    const { noDownloadList } = getState();
    const trackId = payload.id;

    if (noDownloadList.includes(trackId)) {
      dispatch({
        type: REMOVE_TRACK_FROM_NO_DOWNLOAD_LIST,
        payload: trackId,
      })
    }
  }
}

export const addTrackToNoDownloadList = payload => {
  return (dispatch) => {
    dispatch({
      type: ADD_TRACK_TO_NO_DOWNLOAD_LIST,
      payload
    })
  }
}
