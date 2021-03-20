import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { animateScroll } from 'react-scroll';
import queryString from 'query-string';

import {
  fetchMostPopularTracks,
  searchTracks,
  fetchTracksSimilar,
  clearTracklist,
} from '../thunks';
import { getPerPageSetting } from '../utils/helpers';
import { DEFAULT_PAGE } from '../constants/defaults';
import TrackListingGroup from './TrackListingGroup';
import TitleHeader from './TitleHeader';

const MostPopularTracks = ({
  searchType,
  searchId,
  searchName,
  trackListing,
  fetchMostPopularTracks,
  location,
}) => {
  const {
    page = DEFAULT_PAGE,
    per_page = getPerPageSetting(),
  } = queryString.parse(location.search);

  useEffect(() => {
    animateScroll.scrollToTop({ duration: 1500 });
    fetchMostPopularTracks(searchType, searchId, searchName, page, per_page);

    return () => clearTracklist();
  }, [fetchMostPopularTracks, searchType, searchId, searchName, page, per_page]);

  return (
    <Fragment>
      <TitleHeader
        headerPrefix={'MOST POPULAR TRACKS'}
        headerTitle={searchName}
      />
      <TrackListingGroup trackListing={trackListing} />
    </Fragment>
  );
};
const mapStateToProps = (state) => {
  const { trackListing } = state;

  return {
    trackListing,
  };
};

const mapDispatchToProps = {
  fetchMostPopularTracks,
  searchTracks,
  fetchTracksSimilar,
  clearTracklist,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MostPopularTracks);
