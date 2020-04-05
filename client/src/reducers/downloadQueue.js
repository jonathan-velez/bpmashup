import {
  ADD_TRACK_TO_DOWNLOAD_QUEUE,
  UPDATE_DOWNLOAD_QUEUE,
} from '../constants/actionTypes';

const defaultState = {
  addedThisSession: {},
  queue: {},
};

const downloadQueue = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_TRACK_TO_DOWNLOAD_QUEUE: {
      const { queueId, success } = action.payload;
      return {
        ...state,
        addedThisSession: {
          ...state.addedThisSession,
          [queueId]: success,
        },
      };
    }
    case UPDATE_DOWNLOAD_QUEUE: {
      const { payload } = action;
      return {
        ...state,
        queue: {
          ...payload,
        },
      };
    }
    default:
      return state;
  }
};

export default downloadQueue;

/*
{
  queueId: xxxx,
  beatportTrackId: yyyy,
  status: abc,
  addedDate: zzzz,
  downloadDate: aaa,
  errors: true,
  errorCodes: {},
}

*/
