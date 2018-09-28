//root reducer, combines all reducers, which update state
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { firebaseReducer } from 'react-redux-firebase';

import trackListing from './trackListing';
import genreListing from './genreListing';
import isLoading from './isLoading';
import openModal from './openModal';
import playlistList from './playlistList';
import mediaPlayer from './mediaPlayer';
import autoSuggest from './autoSuggest';
import confirmModal from './confirmModal';
import downloadedTracks from './downloadedTracks';
import lovedTracks from './lovedTracks';
import lovedArtists from './lovedArtists';
import lovedLabels from './lovedLabels';

const rootReducer = combineReducers({
  trackListing,
  genreListing,
  isLoading,
  openModal,
  playlistList,
  mediaPlayer,
  autoSuggest,
  confirmModal,
  downloadedTracks,
  lovedTracks,
  lovedArtists,
  lovedLabels,
  firebaseState: firebaseReducer,
  routing: routerReducer,
});

export default rootReducer;
