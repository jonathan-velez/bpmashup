import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { animateScroll } from 'react-scroll';
import queryString from 'query-string';

import {
  fetchMostPopularTracks,
  searchTracks,
  fetchTracksSimilar,
  clearTracklist,
} from '../thunks';
import { deslugify, getPerPageSetting } from '../utils/helpers';
import { DEFAULT_PAGE } from '../constants/defaults';
import TrackListingGroup from './TrackListingGroup';
import TitleHeader from './TitleHeader';
import { DEFAULT_PAGE_TITLE } from '../constants/defaults';

const TrackListingController = ({
  location,
  match,
  searchTracks,
  fetchTracksSimilar,
  fetchMostPopularTracks,
  trackListing,
  clearTracklist,
}) => {
  const { url, params } = match;
  const { type, searchId, searchString, searchTerm, trackId } = params;
  const {
    page = DEFAULT_PAGE,
    perPage = getPerPageSetting(),
  } = queryString.parse(location.search);

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
  }, [
    fetchMostPopularTracks,
    fetchTracksSimilar,
    searchTracks,
    clearTracklist,
    trackId,
    searchTerm,
    type,
    searchId,
    searchString,
    page,
    perPage,
  ]);

  const pageName = url.split('/')[1];
  let headerTitle = '';
  let headerPrefix = '';
  const headerType = type;
  const headerId = +searchId;

  switch (pageName) {
    case 'search':
      headerPrefix = 'Search Results';
      headerTitle = params.searchTerm;
      break;
    case 'most-popular':
      headerPrefix = 'Top Tracks';
      headerTitle = params.searchString;
      break;
    case 'similar-tracks':
      headerPrefix = 'Similar To';
      headerTitle = params.trackName;
      break;
    default:
      headerPrefix = 'Top Tracks';
      headerTitle = 'All Genres';
  }

  return (
    <>
      <Helmet>
        <title>
          {headerPrefix} - {headerTitle} :: {DEFAULT_PAGE_TITLE}
        </title>
      </Helmet>
      <TitleHeader
        headerPrefix={headerPrefix}
        headerTitle={headerTitle}
        headerId={headerId}
        headerType={headerType}
      />
      <TrackListingGroup trackListing={trackListing} />
    </>
  );
};
const mapStateToProps = (state) => {
  const { trackListing, isLoading } = state;

  return {
    trackListing,
    isLoading,
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
)(TrackListingController);
