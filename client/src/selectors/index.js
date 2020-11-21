import { createSelector } from 'reselect';
import _ from 'lodash';

import { getUserDownloadQueueTrackIds } from './userActivity';

const getUserAuth = (state) => state.firebaseState && state.firebaseState.auth;
const getUserProfile = (state) =>
  state.firebaseState && state.firebaseState.profile;
const getPlaylists = (state) => state.playlistList;
const getUserPermissions = (state) =>
  state.userDetail && state.userDetail.permissions;

const getDownloadQueue = (state) => state.downloadQueue.queue;
const _getLovedTracks = (state) => state.lovedTracks;
const _getTracklistTracks = (state) =>
  state.trackListing && state.trackListing.tracks;

export const getLovedTrackIds = createSelector(
  [_getLovedTracks],
  (tracks) => Object.keys(_.pickBy(tracks, (track) => track.loved)),
);

export const getUserId = createSelector(
  [getUserAuth],
  (auth) => auth.uid,
);
export const getUserPhotoURL = createSelector(
  [getUserProfile],
  (profile) => {
    return profile.photoURL;
  },
);
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
  (playlists) => _.map(playlists, (playlist) => playlist.trackIds).flat(),
);
export const listOfPlaylists = createSelector(
  [getPlaylists],
  (playlists) => _.map(playlists, (playlist) => playlist.name),
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

export const hasZippyPermission = createSelector(
  [getUserPermissions],
  (permissions) => Array.isArray(permissions) && permissions.includes('zipZip'),
);

// select expired or already downloaded files
export const getArchivedDownloadQueueItems = createSelector(
  [getDownloadQueue],
  (queue) =>
    _.filter(
      queue,
      (item) =>
        item.status === 'downloaded',
    ),
);

// select files which haven't been downloaded
export const getCurrentDownloadQueueItems = createSelector(
  [getDownloadQueue],
  (queue) => _.filter(queue, (item) => item.status !== 'downloaded'),
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

const _playlistTrackIds = (state, playlistId) => {
  const playlists = getPlaylists(state);
  return playlists[playlistId] && playlists[playlistId].trackIds;
};

export const getPlaylistTrackIds = createSelector(
  [_playlistTrackIds],
  (trackIds) => trackIds,
);

export const getTracklistGenreCount = createSelector(
  [_getTracklistTracks],
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

export const getTracklistTrackCount = createSelector(
  [_getTracklistTracks],
  (tracks) => {
    return (tracks && Object.keys(tracks).length) || 0;
  },
);

const _getCurrentTrackStatus = (state) => {
  const { loadedTrack, playing } = state.mediaPlayer;
  return {
    trackId: loadedTrack.id,
    playing,
  };
};

const _isTrackPlaying = (state, id) => {
  const { trackId, playing } = _getCurrentTrackStatus(state);
  return playing && trackId === id;
};

const _isTrackLoaded = (state, id) => {
  const { trackId } = _getCurrentTrackStatus(state);
  return trackId === id;
};

export const isTrackPlaying = createSelector(
  [_isTrackPlaying],
  (isPlaying) => isPlaying,
);

export const isTrackLoaded = createSelector(
  [_isTrackLoaded],
  (isLoaded) => isLoaded,
);
