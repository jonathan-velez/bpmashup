import _ from 'lodash';
import {
  UPDATE_SUGGESTION_INPUT_VALUE,
  CLEAR_SUGGESTIONS,
  LOAD_SUGGESTIONS
} from '../constants/actionTypes';

const defaultState = {
  value: '',
  suggestions: []
};

const autoSuggest = (state = defaultState, action) => {
  if (_.get(action, 'payload') === undefined || action.error) {
    return state;
  }
  switch (action.type) {
    case UPDATE_SUGGESTION_INPUT_VALUE:
      return {
        ...state,
        value: action.payload
      }
    case CLEAR_SUGGESTIONS:
      return defaultState;
    case LOAD_SUGGESTIONS:
      return {
        ...state,
        suggestions: action.payload.data.results,
      };
    default:
      return state;
  }
}

export default autoSuggest;