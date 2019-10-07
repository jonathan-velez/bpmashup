import { createSelector } from 'reselect';
import _ from 'lodash';

const getPlaylists = state => state.playlistList;

export const getPlaylistTracks = (state = {}, props = {}) => {
  const { match = {} } = props;
  const { params = {} } = match;
  const { playlistId } = params;

  return playlistId ? state.playlistList[playlistId] && state.playlistList[playlistId].tracks : {};
}

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
