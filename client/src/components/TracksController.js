import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import _ from 'lodash';

import TrackListingGroup from './TrackListingGroup';
import FilterBar from './FilterBar';
import { getTracks } from '../thunks';
import { usePrevious } from '../hooks';

const TracksController = ({ trackQuery, search, trackListing, getTracks }) => {
  const previousTrackQuery = usePrevious(trackQuery);

  useEffect(() => {
    const fetchTracks = (trackQuery) => {
      Scroll.animateScroll.scrollToTop({ duration: 1500 });
      getTracks(trackQuery);
    };

    if (
      !previousTrackQuery ||
      (previousTrackQuery && !_.isEqual(previousTrackQuery, trackQuery))
    ) {
      fetchTracks(trackQuery);
    }
  }, [trackQuery, getTracks, previousTrackQuery]);

  return (
    <Fragment>
      <FilterBar search={search} />
      <TrackListingGroup trackListing={trackListing} />
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    trackListing: state.trackListing,
  };
};

const mapDispatchToProps = { getTracks };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TracksController);
