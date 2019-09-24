import { createSelector } from 'reselect';
import _ from 'lodash';

const getPlaylists = state => state.playlistList;

export const listOfTracksAddedToPlaylist = createSelector([getPlaylists], playlists => _.map(playlists, playlist => playlist.listOfTracks).flat());
export const listOfPlaylists = createSelector([getPlaylists], playlists => _.map(playlists, playlist => playlist.name));
