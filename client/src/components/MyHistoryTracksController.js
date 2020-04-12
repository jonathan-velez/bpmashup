import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { animateScroll } from 'react-scroll';
import queryString from 'query-string';

import TitleHeader from './TitleHeader';
import TrackListingGroup from './TrackListingGroup';
import NothingHereMessage from './NothingHereMessage';
import { DEFAULT_PAGE } from '../constants/defaults';
import { getTracksByIds, clearTracklist } from '../thunks';
import { getPerPageSetting } from '../utils/helpers';
import { getUserHistoryPageSetup } from '../selectors';

const MyHistoryTracksController = ({ location, trackListing, trackIds, headerTitle, getTracksByIds, clearTracklist }) => {
  const { page = DEFAULT_PAGE, perPage = getPerPageSetting() } = queryString.parse(location.search);

  useEffect(() => {
    if (Array.isArray(trackIds) && trackIds.length > 0) {
      animateScroll.scrollToTop({ duration: 300 });
      getTracksByIds(trackIds, page, perPage);
    }

    return () => clearTracklist();
  }, [trackIds, page, perPage, clearTracklist, getTracksByIds]);

  if (trackIds.length === 0) {
    return <NothingHereMessage />;
  }

  return (
    <React.Fragment>
      <TitleHeader headerTitle={headerTitle} />
      <TrackListingGroup trackListing={trackListing} />
    </React.Fragment>
  );
}

const mapStateToProps = (state, ownProps) => {
  const { trackListing = {} } = state;
  const { trackIds = [], headerTitle = '' } = getUserHistoryPageSetup(state, ownProps);

  return {
    trackListing,
    headerTitle,
    trackIds,
  }
}

const mapDispatchToProps = {
  getTracksByIds,
  clearTracklist,
}

export default connect(mapStateToProps, mapDispatchToProps)(MyHistoryTracksController);
