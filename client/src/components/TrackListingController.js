import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { fetchMostPopularTracks, searchTracks, fetchTracksSimilar } from '../thunks';
import { deslugify } from '../utils/helpers';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '../constants/defaults';
import TrackListingGroup from './TrackListingGroup';
import TracklistingHeader from './TracklistingHeader';

class TrackListingController extends React.Component {
  state = {
    selectedView: 'table',
  }

  componentDidMount() {
    const { location, match, searchTracks, fetchTracksSimilar, fetchMostPopularTracks } = this.props;
    const { type, searchId, searchString, searchTerm, trackId } = match.params;
    const { search: thisSearch } = location;

    // parse params
    const params = {};
    thisSearch.replace('?', '').split('&').forEach(param => {
      const splitParam = param.split('=');
      params[splitParam[0]] = splitParam[1];
    });

    const { page = DEFAULT_PAGE, perPage = DEFAULT_PER_PAGE } = params;

    Scroll.animateScroll.scrollToTop({ duration: 1500 });

    // determine if it's a search page, similar tracks or not
    if (searchTerm) {
      searchTracks(deslugify(searchTerm));
    } else if (trackId) {
      fetchTracksSimilar(trackId);
    } else {
      fetchMostPopularTracks(type, searchId, searchString, page, perPage);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isLoading, location, match, searchTracks, fetchTracksSimilar, fetchMostPopularTracks } = this.props;
    const { type, searchId, searchString, searchTerm, trackId } = nextProps.match.params;
    const { search: nextSearch } = nextProps.location;
    const { search: thisSearch } = location;
    const { searchTerm: thisSearchTerm, trackId: thisTrackId, searchId: thisSearchId } = match.params;

    // parse params
    const thisParams = {};
    thisSearch.replace('?', '').split('&').forEach(param => {
      const splitParam = param.split('=');
      thisParams[splitParam[0]] = splitParam[1];
    });
    const nextParams = {};
    nextSearch.replace('?', '').split('&').forEach(param => {
      const splitParam = param.split('=');
      nextParams[splitParam[0]] = splitParam[1];
    });

    // which page are we loading?
    const thisPage = +thisParams.page || DEFAULT_PAGE;
    const newPage = +nextParams.page || DEFAULT_PAGE;

    // how many tracks per page?
    const thisPerPage = +thisParams.perPage || DEFAULT_PER_PAGE;
    const newPerPage = +nextParams.perPage || DEFAULT_PER_PAGE;

    // fetch if we have a new query or new params
    if (((searchId && searchId !== thisSearchId) || (newPage && newPage !== thisPage) || (searchTerm && searchTerm !== thisSearchTerm) || (trackId && trackId !== thisTrackId) || (newPerPage && newPerPage !== thisPerPage)) && !isLoading) {
      Scroll.animateScroll.scrollToTop({ duration: 1500 });

      if (searchTerm) {
        searchTracks(deslugify(searchTerm), newPage, newPerPage);
      } else if (trackId) {
        fetchTracksSimilar(trackId, newPage, newPerPage);
      } else {
        fetchMostPopularTracks(type, searchId, searchString, newPage, newPerPage);
      }
    }
  }

  render() {
    const { trackListing, match } = this.props;
    const { url, params } = match;

    const pageName = url.split('/')[1];
    let headerTitle = '';
    let headerPrefix = '';
    const headerType = params.type;
    const headerId = +params.searchId;

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
      <React.Fragment>
        <TracklistingHeader
          headerPrefix={headerPrefix}
          headerTitle={headerTitle}
          headerId={headerId}
          headerType={headerType}
        />
        <TrackListingGroup trackListing={trackListing} />
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    trackListing: state.trackListing,
    isLoading: state.isLoading,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({ fetchMostPopularTracks, searchTracks, fetchTracksSimilar }), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackListingController);
