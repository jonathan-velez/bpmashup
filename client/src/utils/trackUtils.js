import React from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { scroller } from 'react-scroll';
import _ from 'lodash';

import store from '../store';
import * as actionCreators from '../actions/ActionCreators';
import * as thunks from '../thunks';

export const constructLinks = (listItem, type) => {
  // takes in an array of genres or artists and contructs individual Link objects
  if (!Array.isArray(listItem)) return;

  return listItem.map((val, idx) => {
    const { name, id, slug } = val;
    const returnUrl = `/most-popular/${type}/${slug}/${id}/`;

    return (
      <React.Fragment key={idx}>
        {idx > 0 ? ',' : ''} <Link as='a' key={idx} to={returnUrl}>{name}</Link>
      </React.Fragment>
    )
  });
}

export const downloadTrack = track => {
  return new Promise((resolve, reject) => {
    if (typeof track === 'object') {
      let strSearch = '';

      strSearch = `${track.artists[0].name} ${track.title}`;

      store.dispatch(thunks.downloadTrack(track.id.toString()));

      Axios.get(`/api/download-track?searchString=${strSearch}`)
        .then(res => {
          if (res.data.href) {
            resolve(res.data.href);
          } else {
            reject(null);
          }
        })
        .catch(error => {
          reject(null);
        });
    } else {
      reject(null);
    }
  })
}

export const scrollToTrack = (trackId) => {
  scroller.scrollTo(`track-${trackId}`, {
    duration: 750,
    delay: 50,
    smooth: true,
    offset: -65,
  });
}

export const getNextTrack = (incrementBy = 1) => {
  const { trackListing = {}, mediaPlayer = {} } = store.getState();
  const { tracks = [] } = trackListing;

  if (_.isEmpty(trackListing) || _.isEmpty(mediaPlayer) || tracks.length === 0) {
    return {};
  }

  // sort the tracks by date added if playlist or position of top tracks
  const { metadata } = trackListing;
  const orderTracksBy = metadata.pageType === 'playlist' ? 'dateAdded' : 'position';
  const orderedTracks = _.sortBy(tracks, orderTracksBy);

  // grab the index of the next track
  let nextTrackIndex = orderedTracks.findIndex(obj => obj.id === mediaPlayer.loadedTrack.id) + incrementBy;

  // reset to first track if we reached the end
  if (nextTrackIndex >= orderedTracks.length || nextTrackIndex < 0) {
    nextTrackIndex = 0;
  }

  // grab track object by new id
  let nextTrackObj = orderedTracks[nextTrackIndex];

  scrollToTrack(nextTrackObj.id || 0);

  return nextTrackObj;
}

export const loadNextTrack = (incrementBy = 1) => {
  store.dispatch(actionCreators.loadTrack(getNextTrack(incrementBy)));
}

export const genreLabel = genres => (`Genre${(genres.length > 1 ? "s" : "")}`);

export const labelUrl = label => (`/most-popular/label/${label.slug}/${label.id}`);

// TODO: Fill these in
export const trackGenreColors = {
  'house': 'green',
  'trance': 'blue',
}