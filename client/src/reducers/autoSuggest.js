import {
  UPDATE_SUGGESTION_INPUT_VALUE,
  CLEAR_SUGGESTIONS,
  MAYBE_UPDATE_SUGGESTIONS,
  LOAD_SUGGESTIONS
} from '../constants/actionTypes';

const defaultState = {
  value: '',
  suggestions: []
};

const autoSuggest = (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_SUGGESTION_INPUT_VALUE:    
      return {
        ...state,
        value: action.value
      }
    case CLEAR_SUGGESTIONS:
      return {
        ...state,
        suggestions: [],
      };
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