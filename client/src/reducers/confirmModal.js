import {
  OPEN_CONFIRM,
  RESET_CONFIRM,
  SET_CONFIRM
} from '../constants/actionTypes';

const defaultState = {
  open: false,
  confirm: false,
  content: null,
  size: 'small',
  confirmButtonText: 'OK',
  cancelButtonText: 'Cancel',
}

const confirmModal = (state = defaultState, action) => {
  switch (action.type) {
    case OPEN_CONFIRM:
      return {
        open: true,
        confirm: false,
        content: action.payload.content,
        confirmButtonText: action.payload.confirmButtonText,
        cancelButtonText: action.payload.cancelButtonText,
      }
    case SET_CONFIRM:
      return {
        open: false,
        confirm: action.payload,
      }
    case RESET_CONFIRM:
      return defaultState;
    default:
      return state;
  }
}

export default confirmModal;
