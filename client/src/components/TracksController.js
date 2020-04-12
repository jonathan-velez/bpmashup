import React, { Fragment, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import TrackListingGroup from './TrackListingGroup';
import TitleHeader from './TitleHeader';
import FilterBar from './FilterBar';
import { getTracks } from '../thunks';
import { usePrevious } from '../hooks';

const TracksController = ({
  filterBar,
  trackQuery,
  trackListing,
  getTracks,
  match,
}) => {
  const previousTrackQuery = usePrevious(trackQuery);
  const { params = {} } = match;
  const { itemName } = params;

  useEffect(() => {
    const fetchTracks = (trackQuery) => {
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
      <TitleHeader headerPrefix='TRACKS' headerTitle={itemName} />
      {filterBar && <FilterBar />}
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
)(withRouter(TracksController));
