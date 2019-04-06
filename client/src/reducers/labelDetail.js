import { GET_LABEL_DETAIL } from '../constants/actionTypes';

const defaultState = {
  labelData: {},
  releasesData: [],
}

const labelDetail = (state = defaultState, action) => {
  switch (action.type) {
    case GET_LABEL_DETAIL: {
      const { payload } = action;
      const { labelData, releasesData } = payload;

      return {
        ...defaultState,
        labelData,
        releasesData,
      }
    }
    default:
      return state;
  }
}

export default labelDetail;
