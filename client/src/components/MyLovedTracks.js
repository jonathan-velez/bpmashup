import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { animateScroll } from 'react-scroll';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';

import TitleHeader from './TitleHeader';
import TrackListingGroup from './TrackListingGroup';
import NothingHereMessage from './NothingHereMessage';
import { DEFAULT_PAGE } from '../constants/defaults';
import { getTracksByIds } from '../thunks';
import { getPerPageSetting } from '../utils/helpers';
import { getLovedTrackIds } from '../selectors';

const MyLovedTracks = ({
  location = {},
  trackListing,
  trackIds,
  getTracksByIds,
}) => {
  const {
    page = DEFAULT_PAGE,
    perPage = getPerPageSetting(),
  } = queryString.parse(location.search || {});

  useEffect(() => {
    if (trackIds) {
      animateScroll.scrollToTop({ duration: 300 });
      getTracksByIds(trackIds, page, perPage);
    }
  }, [trackIds, page, perPage, getTracksByIds]);

  if (trackIds.length === 0) {
    return <NothingHereMessage />;
  }

  return (
    <React.Fragment>
      <TitleHeader headerTitle='My Loved Tracks' />
      <TrackListingGroup trackListing={trackListing} />
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const lovedTracks = getLovedTrackIds(state);
  const trackIds = lovedTracks.join(',');

  return {
    trackListing: state.trackListing,
    trackIds,
  };
};

const mapDispatchToProps = {
  getTracksByIds,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(MyLovedTracks));
