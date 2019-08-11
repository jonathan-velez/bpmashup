import { LOAD_NO_DOWNLOADS_TRACKS, ADD_TRACK_TO_NO_DOWNLOAD_LIST } from '../constants/actionTypes';

const noDownloadList = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case LOAD_NO_DOWNLOADS_TRACKS:
      if (!payload) {
        return state;
      }

      return [...new Set(state.concat(payload))];
    case ADD_TRACK_TO_NO_DOWNLOAD_LIST:
      if (!payload) {
        return state;
      }

      return [...state, payload.id];
    default:
      return state;
  }
}

export default noDownloadList;
