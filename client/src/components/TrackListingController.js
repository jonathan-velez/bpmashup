import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import * as actionCreators from '../actions/ActionCreators';
import { deslugify } from '../utils/helpers';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '../constants/defaults';
import TrackListingCards from './TrackListingCards';
import TracklistingHeader from './TracklistingHeader';
import TrackListingTable from './TrackListingTable';
import TrackListingActionRow from './TrackListingActionRow';
import Pager from './Pager';

class TrackListingController extends React.Component {
  state = {
    selectedView: 'table',
  }

  componentDidMount() {
    const { location, match, startAsync, searchTracks, fetchTracksSimilar, fetchTracks } = this.props;
    const { type, searchId, searchString, searchTerm, trackId } = match.params;
    const { search: thisSearch } = location;

    // parse params
    const params = {};
    thisSearch.replace('?', '').split('&').forEach(param => {
      const splitParam = param.split('=');
      params[splitParam[0]] = splitParam[1];
    });

    const page = params.page || DEFAULT_PAGE;
    const perPage = params.perPage || DEFAULT_PER_PAGE;

    Scroll.animateScroll.scrollToTop({ duration: 1500 });
    startAsync();

    // determine if it's a search page, similar tracks or not
    if (searchTerm) {
      searchTracks(deslugify(searchTerm));
    } else if (trackId) {
      fetchTracksSimilar(trackId);
    } else {
      fetchTracks(type, searchId, searchString, page, perPage);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isLoading, location, match, startAsync, searchTracks, fetchTracksSimilar, fetchTracks } = this.props;
    const { type, searchId, searchString, searchTerm, trackId } = nextProps.match.params;
    const { search: nextSearch } = nextProps.location;
    const { search: thisSearch } =  location;
    const { searchTerm: thisSearchTerm, trackId: thisTrackId, searchId: thisSearchId } =  match.params;

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
    if (((searchId && searchId !== thisSearchId) || (newPage && newPage !== thisPage) || (searchTerm && searchTerm !== thisSearchTerm) || (trackId && trackId !== thisTrackId) || (newPerPage && newPerPage !== thisPerPage)) && ! isLoading) {
      Scroll.animateScroll.scrollToTop({ duration: 1500 });
      startAsync();

      if (searchTerm) {
        searchTracks(deslugify(searchTerm), newPage, newPerPage);
      } else if (trackId) {
        fetchTracksSimilar(trackId, newPage, newPerPage);
      } else {
        fetchTracks(type, searchId, searchString, newPage, newPerPage);
      }
    }
  }

  render() {
    const { trackListing, isLoading, match } = this.props;
    const { tracks, metadata, tracklistView } = trackListing;
    const { totalPages, page, perPage } = metadata;
    const { url, params } = match;

    const pageName = url.split('/')[1];
    let headerTitle = '';
    let headerPrefix = '';
    const headerType = params.type;
    const headerId = params.searchId;

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
        <TrackListingActionRow activePage={page} totalPages={totalPages} perPage={perPage} isLoading={isLoading} />
        {tracklistView === 'cards' ?
          <TrackListingCards trackListing={tracks} isLoading={isLoading} />
          :
          <TrackListingTable trackListing={tracks} isLoading={isLoading} isPlaylist={false} page={page} perPage={perPage} />
        }
        <Pager activePage={page} totalPages={totalPages} firstItem={null} lastItem={null} perPage={perPage || DEFAULT_PER_PAGE} isLoading={isLoading} />
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
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackListingController);