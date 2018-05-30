import { OPEN_MODAL } from '../constants/actionTypes';

const defaultState = {
  open: false
}

const openModal = (state = defaultState, action) => {
  switch (action.type) {
    case OPEN_MODAL:
      return {
        ...state,
        open: action.payload
      }
    default:
      return state;
  }
}

export default openModal;
