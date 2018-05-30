import {
  OPEN_CONFIRM,
  RESET_CONFIRM,
  SET_CONFIRM
} from '../constants/actionTypes';

const defaultState = {
  open: false,
  confirm: false,
}

const confirmModal = (state = defaultState, action) => {
  switch (action.type) {
    case OPEN_CONFIRM:
      return {
        open: true,
        confirm: false,
      }
    case SET_CONFIRM:
      return {
        open: false,
        confirm: action.payload,
      }
    case RESET_CONFIRM:
      return {
        open: false,
        confirm: false,
      }
    default:
      return state;
  }
}

export default confirmModal;
