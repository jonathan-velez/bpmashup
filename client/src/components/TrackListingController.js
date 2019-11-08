import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import _ from 'lodash';

import { fetchMostPopularTracks, searchTracks, fetchTracksSimilar, clearTracklist } from '../thunks';
import { deslugify } from '../utils/helpers';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '../constants/defaults';
import TrackListingGroup from './TrackListingGroup';
import TracklistingHeader from './TracklistingHeader';

class TrackListingController extends React.Component {
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

  componentDidUpdate(prevProps) {
    if (_.isEqual(prevProps, this.props)) {
      return;
    }
    const { isLoading, location, match, searchTracks, fetchTracksSimilar, fetchMostPopularTracks } = this.props;
    const { searchId: prevSearchId, searchTerm: prevSearchTerm, trackId: prevTrackId } = prevProps.match.params;
    const { search: prevSearch } = prevProps.location;
    const { search: thisSearch } = location;
    const { type: thisType, searchString: thisSearchString, searchTerm: thisSearchTerm, trackId: thisTrackId, searchId: thisSearchId } = match.params;

    // parse params
    const thisParams = {};
    thisSearch.replace('?', '').split('&').forEach(param => {
      const splitParam = param.split('=');
      thisParams[splitParam[0]] = splitParam[1];
    });
    const prevParams = {};
    prevSearch.replace('?', '').split('&').forEach(param => {
      const splitParam = param.split('=');
      prevParams[splitParam[0]] = splitParam[1];
    });

    // which page are we loading?
    const thisPage = +thisParams.page || DEFAULT_PAGE;
    const prevPage = +prevParams.page || DEFAULT_PAGE;

    // how many tracks per page?
    const thisPerPage = +thisParams.perPage || DEFAULT_PER_PAGE;
    const prevPerPage = +prevParams.perPage || DEFAULT_PER_PAGE;

    // fetch if we have a new query or new params
    if (((prevSearchId !== thisSearchId) || (prevPage !== thisPage) || (prevSearchTerm !== thisSearchTerm) || (prevTrackId !== thisTrackId) || (prevPerPage !== thisPerPage)) && !isLoading) {
      Scroll.animateScroll.scrollToTop({ duration: 1500 });

      if (thisSearchTerm) {
        searchTracks(deslugify(thisSearchTerm), thisPage, thisPerPage);
      } else if (thisTrackId) {
        fetchTracksSimilar(thisTrackId, thisPage, thisPerPage);
      } else {
        fetchMostPopularTracks(thisType, thisSearchId, thisSearchString, thisPage, thisPerPage);
      }
    }
  }

  componentWillUnmount() {
    this.props.clearTracklist();
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
  return bindActionCreators(Object.assign({ fetchMostPopularTracks, searchTracks, fetchTracksSimilar, clearTracklist }), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackListingController);
