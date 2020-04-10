import { GET_RELEASE_DATA } from '../constants/actionTypes';

const defaultState = {
  releaseName: '',
  releaseId: null,
  tracks: {},
}

const release = (state = defaultState, action) => {
  switch (action.type) {
    case GET_RELEASE_DATA:
      return action.payload;
    default:
      return state;
  }
}

export default release;
