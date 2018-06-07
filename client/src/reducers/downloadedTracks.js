import { DOWNLOAD_TRACK, LOAD_DOWNLOADED_TRACKS } from '../constants/actionTypes';

const downloadedTracks = (state = [], action) => {
  switch(action.type) {
    case DOWNLOAD_TRACK:
      if(!action.payload){
        return state;
      }
      return [...state, action.payload];
    case LOAD_DOWNLOADED_TRACKS:
      const {payload: newTracks = [] } = action;
      return [... new Set(state.concat(newTracks))];
      return state;
    default:
      return state;
  }
}

export default downloadedTracks;
