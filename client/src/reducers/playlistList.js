/* eslint-disable no-unused-vars */
import { v4 } from 'node-uuid';
import Moment from 'moment';
import _ from 'lodash';

import {
  ADD_PLAYLIST,
  ADD_TO_PLAYLIST,
  REMOVE_FROM_PLAYLIST,
  EDIT_PLAYLIST_NAME,
  DELETE_PLAYLIST,
  LOAD_PLAYLISTS,
  CLEAR_PLAYLISTS,
  CLEAR_PLAYLIST,
} from '../constants/actionTypes';

const playlistList = (state = {}, action) => {
  const unixStamp = Moment().unix();

  // add a timestamp to the track being added so we can sort the tracklist correctly when loaded
  const track = _.get(action.payload, 'track');
  const newTrack = track && Object.assign({}, track, { dateAdded: unixStamp });

  switch (action.type) {
    case ADD_PLAYLIST: {
      const playlistId = v4();

      return {
        ...state,
        [playlistId]: {
          name: action.payload.name,
          id: playlistId,
          tracks: {
            ...state.tracks,
            [newTrack.id]: newTrack
          },
          listOfTracks: [
            newTrack.id
          ],
          dateAdded: unixStamp
        }
      }
    }
    case ADD_TO_PLAYLIST:
      return {
        ...state,
        [action.payload.playlist.id]: {
          ...state[action.payload.playlist.id],
          tracks: {
            ...state[action.payload.playlist.id].tracks,
            [newTrack.id]: newTrack
          },
          listOfTracks: [
            ...state[action.payload.playlist.id].listOfTracks || [],
            newTrack.id
          ]
        }
      }
    case REMOVE_FROM_PLAYLIST: {
      //////// 'old school way' ////////////
      // let copy = Object.assign({}, state);      
      // delete copy[action.payload.playlistId].tracks[action.payload.trackId];      
      // return copy;

      //////// 'cool kids way' ////////////
      let { [action.payload.trackId]: deletedTrack, ...tracks } = state[action.payload.playlistId].tracks;
      let listOfTracks = state[action.payload.playlistId].listOfTracks.filter(trackId => trackId !== +action.payload.trackId);

      return {
        ...state,
        [action.payload.playlistId]: {
          ...state[action.payload.playlistId],
          tracks,
          listOfTracks
        }
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
    case DELETE_PLAYLIST: {
      const { [action.payload]: deletedPlaylist, ...restOfPlaylists } = state;
      return restOfPlaylists;
    }
    case CLEAR_PLAYLIST: {
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          listOfTracks: [],
          tracks: {},
        }
      }
    }
    case LOAD_PLAYLISTS:
      return action.payload;
    case CLEAR_PLAYLISTS:
      return {};
    default:
      return state;
  }
}

export default playlistList;
