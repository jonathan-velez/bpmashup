import {
  ADD_ACTION_MESSAGE,
  REMOVE_ACTION_MESSAGE
} from '../constants/actionTypes';

const actionMessage = (state = {}, action) => {
  switch (action.type) {
    case ADD_ACTION_MESSAGE: {
      return {
        ...state,
        [action.payload.id]: action.payload.message,
      }
    }
    case REMOVE_ACTION_MESSAGE: {
      const { [action.payload]: deletedMessage, ...restOfMessages } = state;
      return restOfMessages;
    }
    default:
      return state;
  }
}

export default actionMessage;
