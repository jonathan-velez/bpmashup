import { DOWNLOAD_TRACK, LOAD_DOWNLOADED_TRACKS, CLEAR_DOWNLOADS } from '../constants/actionTypes';

const downloadedTracks = (state = [], action) => {
  const { payload: track, type } = action;
  switch (type) {
    case DOWNLOAD_TRACK: {
      if (!track) {
        return state;
      }
      return [...state, track.id];
    }
    case LOAD_DOWNLOADED_TRACKS: {
      const { payload: newTracks = [] } = action;
      return [...new Set(state.concat(newTracks))];
    }
    case CLEAR_DOWNLOADS: {
      return [];
    }
    default:
      return state;
  }
}

export default downloadedTracks;
