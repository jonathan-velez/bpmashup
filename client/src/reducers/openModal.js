import { OPEN_MODAL } from '../constants/actionTypes';

const defaultState = {
  open: false
}

const openModal = (state = defaultState, action) => {
  const { payload } = action;

  switch (action.type) {
    case OPEN_MODAL:
      return {
        ...state,
        open: payload.open,
        title: payload.title,
        body: payload.body,
        headerIcon: payload.headerIcon,
        actionPending: payload.actionPending,
      }
    default:
      return state;
  }
}

export default openModal;
