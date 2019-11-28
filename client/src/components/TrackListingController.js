import React, { Fragment, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { fetchMostPopularTracks, searchTracks, fetchTracksSimilar, clearTracklist } from '../thunks';
import { deslugify, getPerPageSetting } from '../utils/helpers';
import { DEFAULT_PAGE } from '../constants/defaults';
import TrackListingGroup from './TrackListingGroup';
import TracklistingHeader from './TracklistingHeader';

const TrackListingController = ({ location, match, searchTracks, fetchTracksSimilar, fetchMostPopularTracks, trackListing, clearTracklist }) => {
  const { url, params } = match;
  const { type, searchId, searchString, searchTerm, trackId } = params;
  const { search } = location;

  // parse params
  const parsedParams = {};
  search.replace('?', '').split('&').forEach(param => {
    const splitParam = param.split('=');
    parsedParams[splitParam[0]] = splitParam[1];
  });

  const { page = DEFAULT_PAGE, perPage = getPerPageSetting() } = parsedParams;

  useEffect(() => {
    Scroll.animateScroll.scrollToTop({ duration: 1500 });

    // determine if it's a search page, similar tracks or not
    if (searchTerm) {
      searchTracks(deslugify(searchTerm));
    } else if (trackId) {
      fetchTracksSimilar(trackId);
    } else {
      fetchMostPopularTracks(type, searchId, searchString, page, perPage);
    }

    return clearTracklist();
  }, [searchTerm, type, searchId, searchString, page, perPage]);

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
const mapStateToProps = state => {
  return {
    trackListing: state.trackListing,
    isLoading: state.isLoading,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({ fetchMostPopularTracks, searchTracks, fetchTracksSimilar, clearTracklist }), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackListingController);
