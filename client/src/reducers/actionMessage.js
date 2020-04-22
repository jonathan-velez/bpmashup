import {
  ADD_ACTION_MESSAGE,
  REMOVE_ACTION_MESSAGE,
} from '../constants/actionTypes';

const actionMessage = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_ACTION_MESSAGE: {
      return {
        ...state,
        [payload.id]: {
          message: payload.message,
          messageType: payload.messageType,
        },
      };
    }
    case REMOVE_ACTION_MESSAGE: {
      const { [payload]: deletedMessage, ...restOfMessages } = state;
      return restOfMessages;
    }
    default:
      return state;
  }
};

export default actionMessage;
