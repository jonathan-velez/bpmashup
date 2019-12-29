import { createSelector } from 'reselect';
import _ from 'lodash';

import { getUserHistoryPageSetup } from './userHistory';

const getUserAuth = state => state.firebaseState && state.firebaseState.auth;
const getUserProfile = state => state.firebaseState && state.firebaseState.profile;
const getPlaylists = state => state.playlistList;
const getUserPermissions = state => state.userDetail && state.userDetail.permissions;
const getPlaylistTracks = (state = {}, props = {}) => {
  const { match = {} } = props;
  const { params = {} } = match;
  const { playlistId } = params;

  return playlistId ? state.playlistList[playlistId] && state.playlistList[playlistId].tracks : {};
}
const _hasBeenDownloaded = (state, trackId) => {
  const { downloadedTracks } = state;
  return downloadedTracks.includes(trackId);
}

export const getUserId = createSelector([getUserAuth], auth => auth.uid);
export const getUserPhotoURL = createSelector([getUserProfile, getUserAuth], (profile, auth) => {
  return profile.photoURL //|| auth.photoURL;
});
export const getUserDisplayName = createSelector([getUserProfile, getUserAuth], (profile, auth) => {
  return profile.displayName || auth.displayName;
});
export const getFirstAndLastName = createSelector([getUserProfile], (profile) => {
  return profile.displayName && profile.displayName.split(' ');
});
export const getUserProfilePhotoUrl = createSelector([getUserAuth], (auth) => auth.photoURL);
export const listOfTracksAddedToPlaylist = createSelector([getPlaylists], playlists => _.map(playlists, playlist => playlist.listOfTracks).flat());
export const listOfPlaylists = createSelector([getPlaylists], playlists => _.map(playlists, playlist => playlist.name));
export const numOfPlaylists = createSelector([listOfPlaylists], playlists => playlists.length || 0);
export const numOfTracksInPlaylists = createSelector([listOfTracksAddedToPlaylist], tracks => tracks.length || 0);
export const getPlaylistsSortedByAddedDate = createSelector([getPlaylists], playlists => _.sortBy(playlists, 'dateAdded'));
export const getPlaylistGenreCount = createSelector([getPlaylistTracks], tracks => {
  const genreCount = {};
  if (tracks && Object.keys(tracks).length > 0) {
    Object.values(tracks).forEach(track => {
      const { id, slug, name } = track.genres[0];
      const count = genreCount[id] ? genreCount[id].count + 1 : 1;

      genreCount[id] = {
        count,
        id,
        slug,
        name,
      }
    }
    );
  }

  return genreCount;
})
export const getPlaylistTrackCount = createSelector([getPlaylistTracks], tracks => {
  return (tracks && Object.keys(tracks).length) || 0;
})

export const hasZippyPermission = createSelector([getUserPermissions], permissions => Array.isArray(permissions) && permissions.includes('zipZip'));

export const hasBeenDownloaded = createSelector([_hasBeenDownloaded], downloaded => downloaded);

export { getUserHistoryPageSetup };
