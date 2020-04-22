import { LOAD_PERMS } from '../constants/actionTypes';

const defaultState = {
  permissions: [],
}

const userDetail = (state = defaultState, action) => {
  const permissions = action.payload;
  switch (action.type) {
    case LOAD_PERMS: {
      return {
        ...state,
        permissions,
      }
    }
    default:
      return state;
  }
}

export default userDetail;
