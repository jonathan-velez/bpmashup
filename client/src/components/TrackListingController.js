import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { animateScroll } from 'react-scroll';
import queryString from 'query-string';

import { fetchMostPopularTracks, searchTracks, fetchTracksSimilar, clearTracklist } from '../thunks';
import { deslugify, getPerPageSetting } from '../utils/helpers';
import { DEFAULT_PAGE } from '../constants/defaults';
import TrackListingGroup from './TrackListingGroup';
import TracklistingHeader from './TracklistingHeader';

const TrackListingController = ({ location, match, searchTracks, fetchTracksSimilar, fetchMostPopularTracks, trackListing, clearTracklist }) => {
  const { url, params } = match;
  const { type, searchId, searchString, searchTerm, trackId } = params;
  const { page = DEFAULT_PAGE, perPage = getPerPageSetting() } = queryString.parse(location.search);

  useEffect(() => {
    animateScroll.scrollToTop({ duration: 1500 });

    // determine if it's a search page, similar tracks or not
    if (searchTerm) {
      searchTracks(deslugify(searchTerm));
    } else if (trackId) {
      fetchTracksSimilar(trackId);
    } else {
      fetchMostPopularTracks(type, searchId, searchString, page, perPage);
    }

    return () => clearTracklist();
  }, [fetchMostPopularTracks, fetchTracksSimilar, searchTracks, clearTracklist, trackId, searchTerm, type, searchId, searchString, page, perPage]);

  const pageName = url.split('/')[1];
  let headerTitle = '';
  let headerPrefix = '';
  const headerType = type;
  const headerId = +searchId;

  switch (pageName) {
    case 'search':
      headerPrefix = 'SEARCH RESULTS:';
      headerTitle = params.searchTerm;
      break;
    case 'most-popular':
      headerPrefix = 'TOP TRACKS:';
      headerTitle = params.searchString;
      break;
    case 'similar-tracks':
      headerPrefix = 'SIMILAR TO:';
      headerTitle = params.trackName;
      break;
    default:
      headerPrefix = 'TOP TRACKS';
      headerTitle = 'ALL GENRES';
  }

  return (
    <Fragment>
      <TracklistingHeader
        headerPrefix={headerPrefix}
        headerTitle={headerTitle}
        headerId={headerId}
        headerType={headerType}
      />
      <TrackListingGroup trackListing={trackListing} />
    </Fragment>
  )
}
const mapStateToProps = (state) => {
  const { trackListing, isLoading } = state;

  return {
    trackListing,
    isLoading,
  }
}

const mapDispatchToProps = {
  fetchMostPopularTracks,
  searchTracks,
  fetchTracksSimilar,
  clearTracklist
};

export default connect(mapStateToProps, mapDispatchToProps)(TrackListingController);
