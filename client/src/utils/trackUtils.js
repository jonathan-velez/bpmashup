import React from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { scroller } from 'react-scroll';
import store from '../store';
import * as actionCreators from '../actions/ActionCreators';

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
  if (typeof track === 'object') {
    let strSearch = '';

    strSearch = `${track.artists[0].name} ${track.title}`;

    Axios.get(`/api/download-track?searchString=${strSearch}`)
      .then(res => {
        console.log(res);
        if (res.data.href) {
          console.log('open open')
          window.open(res.data.href, '_blank');
        } else {
          // TODO: handle this shit and display a message
          console.log('not able to find a track to download');
        }
      })
      .catch(error => {
        console.log('error downloading track', error);
      });
  } else {
    console.log('no track to download');
  }
}

export const scrollToTrack = (trackId) => {
  console.log('scrolling to', trackId)
  scroller.scrollTo(`track-${trackId}`, {
    duration: 750,
    delay: 50,
    smooth: true,
    offset: -65,
  });
}

export const getNextTrack = (incrementBy = 1) => {  
  const { trackListing, mediaPlayer } = store.getState();  
  const { tracks } = trackListing;

  const keys = Object.keys(tracks);
  let nextTrackId = keys.indexOf(mediaPlayer.loadedTrack.id.toString()) + incrementBy;

  if (nextTrackId <= 0 || keys.length === nextTrackId) {
    nextTrackId = 0;
  }

  scrollToTrack(tracks[keys[nextTrackId]].id);

  return tracks[keys[nextTrackId]];
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