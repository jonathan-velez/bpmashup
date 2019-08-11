import { DOWNLOAD_TRACK, LOAD_DOWNLOADED_TRACKS } from '../constants/actionTypes';

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
    default:
      return state;
  }
}

export default downloadedTracks;
