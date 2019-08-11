import { DOWNLOAD_TRACK, ADD_TRACK_TO_NO_DOWNLOAD_LIST } from '../constants/actionTypes';

export const downloadTrack = payload => {
  return (dispatch) => {
    dispatch({
      type: DOWNLOAD_TRACK,
      payload
    })

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
