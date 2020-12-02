import { LOAD_PERMS, LOAD_PREFERENCES } from '../constants/actionTypes';

const defaultPreferences = {
  fallbackYouTube: true,
};

const defaultState = {
  permissions: [],
  preferences: defaultPreferences,
};

const userDetail = (state = defaultState, action) => {
  const { payload } = action;
  switch (action.type) {
    case LOAD_PERMS: {
      return {
        ...state,
        permissions: payload,
      };
    }
    case LOAD_PREFERENCES: {
      return {
        ...state,
        preferences: payload,
      };
    }
    default:
      return state;
  }
};

export default userDetail;
