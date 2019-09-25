import { createSelector } from 'reselect';
import _ from 'lodash';

const getPlaylists = state => state.playlistList;

export const listOfTracksAddedToPlaylist = createSelector([getPlaylists], playlists => _.map(playlists, playlist => playlist.listOfTracks).flat());
export const listOfPlaylists = createSelector([getPlaylists], playlists => _.map(playlists, playlist => playlist.name));
export const numOfPlaylists = createSelector([listOfPlaylists], playlists => playlists.length || 0);
export const numOfTracksInPlaylists = createSelector([listOfTracksAddedToPlaylist], tracks => tracks.length || 0);
export const getPlaylistsSortedByAddedDate = createSelector([getPlaylists], playlists => _.sortBy(playlists, 'dateAdded'));
