import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { scroller } from 'react-scroll';
import _ from 'lodash';

import store from '../store';
import { startAsync, stopAsync, openModalWindow, loadTrack } from '../actions/ActionCreators';
import { downloadTrack as downloadTrackThunk, addTrackToNoDownloadList } from '../thunks';

export const constructLinks = (listItem, type, limit = 0) => {
  // takes in an array of genres or artists and contructs individual Link objects
  if (!Array.isArray(listItem)) return;

  return listItem.map((val, idx) => {
    if (limit > 0 && idx >= limit) return null;

    const { name, id, slug } = val;
    // TODO: clean this up
    let returnUrl = '';
    if (type !== 'artist') {
      returnUrl = `/most-popular/${type}/${slug}/${id}/`;
    } else {
      returnUrl = `/artist/${slug}/${id}`;
    }

    return (
      <React.Fragment key={idx}>
        <Link as='a' key={idx} to={returnUrl}>{name}{listItem.length > 1 && idx !== listItem.length - 1 ? ', ' : null}</Link>
      </React.Fragment>
    )
  });
}

export const downloadTrack = track => {
  const handleNoDownload = () => {
    store.dispatch(stopAsync());

    store.dispatch(openModalWindow({
      open: true,
      title: 'Sorry!',
      body: 'No download link found.',
      headerIcon: 'exclamation',
    }));

    store.dispatch(addTrackToNoDownloadList(track));
  }

  if (typeof track === 'object') {
    const artists = track.artists.reduce((acc, artist, idx) => acc += (idx > 0 ? ' ' : '') + artist.name, '');
    let { name, mixName } = track;
    mixName = mixName.replace('Original', '').replace('Mix', '').replace('Version', '').replace('Remix', '');

    store.dispatch(startAsync());

    axios.get(`/api/download-track?artists=${encodeURIComponent(artists)}&name=${encodeURIComponent(name)}&mixName=${encodeURIComponent(mixName)}`)
      .then(res => {
        store.dispatch(stopAsync());
        if (res.data.href) {
          const downloadWindow = window.open('/downloadLink.html', '_blank');
          downloadWindow.location = res.data.href;
          store.dispatch(downloadTrackThunk(track));
        } else {
          handleNoDownload();
        }
      })
      .catch(() => {
        handleNoDownload();
      });
  } else {
    handleNoDownload();
  }
}

export const scrollToTrack = (trackId) => {
  scroller.scrollTo(`track-${trackId}`, {
    duration: 750,
    delay: 50,
    smooth: true,
    offset: -85,
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
  let nextTrackObj = orderedTracks[nextTrackIndex] || {};

  scrollToTrack(nextTrackObj.id || 0);

  return nextTrackObj;
}

export const loadNextTrack = (incrementBy = 1) => {
  store.dispatch(loadTrack(getNextTrack(incrementBy)));
}

export const genreLabel = genres => (`Genre${(genres.length > 1 ? "s" : "")}`);

export const labelUrl = label => (`/label/${label.slug}/${label.id}`);

// TODO: Fill these in
export const trackGenreColors = {
  'house': 'green',
  'trance': 'blue',
}
