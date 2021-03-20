import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { scroller } from 'react-scroll';
import _ from 'lodash';
import firebase from 'firebase';

import store from '../store';
import {
  startAsync,
  stopAsync,
  openModalWindow,
  loadTrack,
} from '../actions/ActionCreators';
import {
  downloadTrack as downloadTrackThunk,
  addTrackToNoDownloadList,
} from '../thunks';
import { API_FILE_EXISTS } from '../constants/apiPaths';

export const constructLinks = (listItem, type, limit = 0) => {
  // takes in an array of genres or artists and contructs individual Link objects
  if (!Array.isArray(listItem)) return;

  return listItem.map((val, idx) => {
    if (limit > 0 && idx >= limit) return null;

    const { name, id, slug } = val;

    let returnUrl = '';
    if (type === 'genre') {
      returnUrl = `/genre/${slug}/${id}/`;
    } else if (type == 'artist') {
      returnUrl = `/artist/${slug}/${id}`;
    } else {
      returnUrl = `/most-popular/${type}/${slug}/${id}/`;
    }

    return (
      <React.Fragment key={idx}>
        <Link as='a' key={idx} to={returnUrl}>
          {name}
          {listItem.length > 1 && idx !== listItem.length - 1 ? ', ' : null}
        </Link>
      </React.Fragment>
    );
  });
};

export const constructTrackLink = (track, className) => {
  const { slug, id, name, mix_name } = track;
  return (
    <Link
      to={{ pathname: `/track/${slug}/${id}`, state: { track } }}
      className={className}
    >
      {name} <span className='track-mix-name'>({mix_name})</span>
    </Link>
  );
};

export const downloadTrack = (track) => {
  const handleNoDownload = () => {
    store.dispatch(stopAsync());

    store.dispatch(
      openModalWindow({
        open: true,
        title: 'Sorry!',
        body: 'No download link found.',
        headerIcon: 'exclamation',
      }),
    );

    store.dispatch(addTrackToNoDownloadList(track));
  };

  if (typeof track === 'object') {
    const artists = track.artists.reduce(
      (acc, artist, idx) => (acc += (idx > 0 ? ' ' : '') + artist.name),
      '',
    );
    let { name, mix_name } = track;
    mix_name = mix_name
      .replace('Original', '')
      .replace('Mix', '')
      .replace('Version', '')
      .replace('Remix', '');

    store.dispatch(startAsync());

    axios
      .get(
        `/api/download-track?artists=${encodeURIComponent(
          artists,
        )}&name=${encodeURIComponent(name)}&mix_name=${encodeURIComponent(
          mix_name,
        )}`,
      )
      .then((res) => {
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
};

export const scrollToTrack = (trackId) => {
  scroller.scrollTo(`track-${trackId}`, {
    duration: 750,
    delay: 50,
    smooth: true,
    offset: -85,
  });
};

export const getNextTrack = (incrementBy = 1) => {
  const { trackListing = {}, mediaPlayer = {} } = store.getState();
  const { tracks = [] } = trackListing;

  if (
    _.isEmpty(trackListing) ||
    _.isEmpty(mediaPlayer) ||
    tracks.length === 0
  ) {
    return {};
  }

  // sort the tracks by date added if playlist or position of top tracks
  const { metadata } = trackListing;
  const orderTracksBy =
    metadata.pageType === 'playlist' ? 'dateAdded' : 'position';
  const orderedTracks = _.sortBy(tracks, orderTracksBy);

  // grab the index of the next track
  let nextTrackIndex =
    orderedTracks.findIndex((obj) => obj.id === mediaPlayer.loadedTrack.id) +
    incrementBy;

  // reset to first track if we reached the end
  if (nextTrackIndex >= orderedTracks.length || nextTrackIndex < 0) {
    nextTrackIndex = 0;
  }

  // grab track object by new id
  let nextTrackObj = orderedTracks[nextTrackIndex] || {};

  scrollToTrack(nextTrackObj.id || 0);

  return nextTrackObj;
};

export const loadNextTrack = (incrementBy = 1) => {
  store.dispatch(loadTrack(getNextTrack(incrementBy)));
};

export const genreLabel = (genres) => `Genre${genres.length > 1 ? 's' : ''}`;

export const labelUrl = (label) => `/label/${label.slug}/${label.id}`;

// TODO: Fill these in
export const trackGenreColors = {
  house: 'green',
  trance: 'blue',
};

export const generateBPTrackLink = ({ slug, id }) => {
  return `https://beatport.com/track/${slug}/${id}`;
};

export const fileExistsOnDownloadServer = async (fileName) => {
  const result = await axios.get(
    `${API_FILE_EXISTS}?fileName=${encodeURIComponent(fileName)}`,
  );
  if (result.status === 200) {
    if (result.data) {
      return result.data.exists;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

// Not used, but didn't want to throw it away
export const getExistingTrackFromGlobalDownloadQueue = async (trackId) => {
  return new Promise(async (resolve) => {
    const firestore = firebase.firestore();
    const trackRef = firestore
      .collection('downloadQueue')
      .where('beatportTrackId', '==', trackId);
    await trackRef
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          return resolve({
            exists: false,
            track: {},
            fileName: null,
            url: null,
          });
        }

        if (!snapshot.empty) {
          const item = snapshot.docs[0];
          const { track, url, fileName } = item.data();

          return resolve({
            exists: true,
            track,
            fileName,
            url,
          });
        }
      })
      .catch((error) => {
        return resolve({
          success: false,
          error,
          exists: false,
          track: {},
          fileName: null,
          url: null,
        });
      });
  });
};
