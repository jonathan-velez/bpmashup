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
import lovedTracks from './lovedTracks';
import lovedArtists from './lovedArtists';
import lovedArtistsDetails from './lovedArtistsDetails';
import lovedLabels from './lovedLabels';
import lovedLabelsDetails from './lovedLabelsDetails';
import lovedCharts from './lovedCharts';
import chartListInfinite from './chartListInfinite';
import searchResults from './searchResults';
import release from './release';
import artistDetail from './artistDetail';
import labelDetail from './labelDetail';
import userDetail from './userDetail';
import noDownloadList from './noDownloadList';
import chartListing from './chartListing';
import actionMessage from './actionMessage';
import downloadQueue from './downloadQueue';
import chartsList from './chartsList';
import releaseList from './releaseList';
import playlistDetails from './playlistDetails';

const rootReducer = combineReducers({
  trackListing,
  genreListing,
  isLoading,
  openModal,
  playlistList,
  mediaPlayer,
  autoSuggest,
  lovedTracks,
  lovedArtists,
  lovedLabels,
  lovedLabelsDetails,
  lovedCharts,
  chartListInfinite,
  firebaseState: firebaseReducer,
  routing: routerReducer,
  searchResults,
  release,
  artistDetail,
  labelDetail,
  userDetail,
  lovedArtistsDetails,
  noDownloadList,
  chartListing,
  actionMessage,
  downloadQueue,
  chartsList,
  releaseList,
  playlistDetails,
});

export default rootReducer;
