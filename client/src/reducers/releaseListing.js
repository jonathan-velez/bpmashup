import { GET_RELEASE_DATA, FETCH_TRACKS_BY_IDS } from '../constants/actionTypes';

const defaultState = {
  releaseName: '',
  releaseId: null,
  tracks: {},
}

const releaseListing = (state = defaultState, action) => {
  switch (action.type) {
    case GET_RELEASE_DATA:
      console.log(action.payload);
      return action.payload;
    default:
      return state;
  }
}

export default releaseListing;
