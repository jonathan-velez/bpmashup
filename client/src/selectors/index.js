import { createSelector } from 'reselect';
import _ from 'lodash';
import moment from 'moment';

import { getUserHistoryPageSetup } from './userHistory';
import { getUserDownloadQueueTrackIds } from './userActivity';
import { convertEpochToDate } from '../utils/helpers';

const getUserAuth = (state) => state.firebaseState && state.firebaseState.auth;
const getUserProfile = (state) =>
  state.firebaseState && state.firebaseState.profile;
const getPlaylists = (state) => state.playlistList;
const getUserPermissions = (state) =>
  state.userDetail && state.userDetail.permissions;
const getPlaylistTracks = (state = {}, props = {}) => {
  const { match = {} } = props;
  const { params = {} } = match;
  const { playlistId } = params;

  return playlistId
    ? state.playlistList[playlistId] && state.playlistList[playlistId].tracks
    : {};
};

const getDownloadQueue = (state) => state.downloadQueue.queue;

export const getUserId = createSelector([getUserAuth], (auth) => auth.uid);
export const getUserPhotoURL = createSelector([getUserProfile], (profile) => {
  return profile.photoURL;
});
export const getUserDisplayName = createSelector(
  [getUserProfile, getUserAuth],
  (profile, auth) => {
    return profile.displayName || auth.displayName;
  },
);
export const getFirstAndLastName = createSelector(
  [getUserProfile],
  (profile) => {
    return profile.displayName && profile.displayName.split(' ');
  },
);
export const getUserProfilePhotoUrl = createSelector(
  [getUserAuth],
  (auth) => auth.photoURL,
);
export const listOfTracksAddedToPlaylist = createSelector(
  [getPlaylists],
  (playlists) => _.map(playlists, (playlist) => playlist.listOfTracks).flat(),
);
export const listOfPlaylists = createSelector([getPlaylists], (playlists) =>
  _.map(playlists, (playlist) => playlist.name),
);
export const numOfPlaylists = createSelector(
  [listOfPlaylists],
  (playlists) => playlists.length || 0,
);
export const numOfTracksInPlaylists = createSelector(
  [listOfTracksAddedToPlaylist],
  (tracks) => tracks.length || 0,
);
export const getPlaylistsSortedByAddedDate = createSelector(
  [getPlaylists],
  (playlists) => _.sortBy(playlists, 'dateAdded'),
);
export const getPlaylistGenreCount = createSelector(
  [getPlaylistTracks],
  (tracks) => {
    const genreCount = {};
    if (tracks && Object.keys(tracks).length > 0) {
      Object.values(tracks).forEach((track) => {
        const { id, slug, name } = track.genres[0];
        const count = genreCount[id] ? genreCount[id].count + 1 : 1;

        genreCount[id] = {
          count,
          id,
          slug,
          name,
        };
      });
    }

    return genreCount;
  },
);
export const getPlaylistTrackCount = createSelector(
  [getPlaylistTracks],
  (tracks) => {
    return (tracks && Object.keys(tracks).length) || 0;
  },
);

export const hasZippyPermission = createSelector(
  [getUserPermissions],
  (permissions) => Array.isArray(permissions) && permissions.includes('zipZip'),
);

export { getUserHistoryPageSetup };

const _queueItemIsExpired = (addedDate) => {
  return moment(convertEpochToDate(addedDate.seconds)).isBefore(
    moment().subtract(1, 'day'),
  );
};

// select expired or already downloaded files
export const getArchivedDownloadQueueItems = createSelector(
  [getDownloadQueue],
  (queue) =>
    _.filter(
      queue,
      (item) =>
        _queueItemIsExpired(item.addedDate) || item.status === 'downloaded',
    ),
);

// select files which haven't been downloaded and have not expired
export const getCurrentDownloadQueueItems = createSelector(
  [getDownloadQueue],
  (queue) =>
    _.filter(
      queue,
      (item) =>
        !_queueItemIsExpired(item.addedDate) && item.status !== 'downloaded',
    ),
);

export const getNumOfTracksAvailableToDownload = createSelector(
  [getCurrentDownloadQueueItems],
  (items) => items.filter((item) => item.status === 'available').length,
);

// TODO: Get full list of download history, replace existing logic

export { getUserDownloadQueueTrackIds };

const _trackHasBeenDownloaded = (state, trackId) =>
  getUserDownloadQueueTrackIds(state).includes(trackId);
export const trackHasBeenDownloaded = createSelector(
  [_trackHasBeenDownloaded],
  (downloaded) => downloaded,
);
