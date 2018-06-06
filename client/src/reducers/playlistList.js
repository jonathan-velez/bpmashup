import { v4 } from 'node-uuid';
import Moment from 'moment';
import _ from 'lodash';

import {
  ADD_PLAYLIST,
  ADD_TO_PLAYLIST,
  REMOVE_FROM_PLAYLIST,
  EDIT_PLAYLIST_NAME,
  DELETE_PLAYLIST,
  LOAD_PLAYLISTS
} from '../constants/actionTypes';

const playlistList = (state = {}, action) => {
  switch (action.type) {
    case ADD_PLAYLIST:
      const playlistId = v4();
      const unixStamp = Moment().unix();
      return {
        ...state,
        [playlistId]: {
          name: action.payload.name,
          id: playlistId,
          tracks: {
            ...state.tracks,
            [action.payload.track.id]: action.payload.track
          },
          listOfTracks: [
            action.payload.track.id
          ],
          dateAdded: unixStamp
        }
      }
    case ADD_TO_PLAYLIST:
      return {
        ...state,
        [action.payload.playlist.id]: {
          ...state[action.payload.playlist.id],
          tracks: {
            ...state[action.payload.playlist.id].tracks,
            [action.payload.track.id]: action.payload.track
          },
          listOfTracks: [
            ...state[action.payload.playlist.id].listOfTracks,
            action.payload.track.id
          ]
        }
      }
    case REMOVE_FROM_PLAYLIST:
      //////// 'old school way' ////////////
      // let copy = Object.assign({}, state);      
      // delete copy[action.payload.playlistId].tracks[action.payload.trackId];      
      // return copy;

      //////// 'cool kids way' ////////////
      let { [action.payload.trackId]: deletedTrack, ...tracks } = state[action.payload.playlistId].tracks;
      let listOfTracks = state[action.payload.playlistId].listOfTracks.filter(trackId => trackId !== action.payload.trackId);

      return {
        ...state,
        [action.payload.playlistId]: {
          ...state[action.payload.playlistId],
          tracks,
          listOfTracks
        }
      }
    case EDIT_PLAYLIST_NAME:
      return {
        ...state,
        [action.payload.playlistId]: {
          ...state[action.payload.playlistId],
          name: action.payload.newName
        }
      }
    case DELETE_PLAYLIST:
      const { [action.payload]: deletedPlaylist, ...restOfPlaylists } = state;
      return restOfPlaylists;
    case LOAD_PLAYLISTS:
      // return Object.assign({}, state, action.payload); 
      return _.merge(state, action.payload);
    default:
      return state;
  }
}

export default playlistList;