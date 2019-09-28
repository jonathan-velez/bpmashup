import {
  LOAD_NO_DOWNLOADS_TRACKS,
  ADD_TRACK_TO_NO_DOWNLOAD_LIST,
  CLEAR_NO_DOWNLOADS,
  REMOVE_TRACK_FROM_NO_DOWNLOAD_LIST,
} from '../constants/actionTypes';

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
    case CLEAR_NO_DOWNLOADS: {
      return [];
    }
    case REMOVE_TRACK_FROM_NO_DOWNLOAD_LIST: {
      return state.filter(val => val === payload ? false : true);
    }
    default:
      return state;
  }
}

export default noDownloadList;
