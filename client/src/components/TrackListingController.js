import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import * as actionCreators from '../actions/ActionCreators';
import { deslugify } from '../utils/helpers';
import TrackListingCards from './TrackListingCards';
import TracklistingHeader from './TracklistingHeader';
import TrackListingTable from './TrackListingTable';
import TrackListingViewToggleButtons from './TrackListingViewToggleButtons';
import Pager from './Pager';

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 20;

class TrackListingController extends React.Component {
  state = {
    selectedView: 'table',
  }

  // TODO: Dry cdm and cwrp up. Maybe use the constructor
  componentDidMount() {
    const { type, searchId, searchString, searchTerm, trackId } = this.props.match.params; // TODO: reduce ambiguity between search vars
    const { search: thisSearch } = this.props.location;
    const thisPage = thisSearch.substr(thisSearch.indexOf('page=') + 5) || DEFAULT_PAGE;
    const perPage = thisSearch.substr(thisSearch.indexOf('perPage=') + 8);

    Scroll.animateScroll.scrollToTop({ duration: 100 });
    this.props.startAsync();

    // determine if it's a search page, similar tracks or not
    if (searchTerm) {
      this.props.searchTracks(deslugify(searchTerm));
    } else if (trackId) {
      this.props.fetchTracksSimilar(trackId);
    } else {
      this.props.fetchTracks(type, searchId, searchString, thisPage, perPage);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { type, searchId, searchString, searchTerm, trackId } = nextProps.match.params;
    const { search: nextSearch } = nextProps.location;
    const { search: thisSearch } = this.props.location;
    const { searchTerm: thisSearchTerm, trackId: thisTrackId } = this.props.match.params;

    // which page we loading?
    const thisPage = thisSearch.substr(thisSearch.indexOf('page=') + 5);
    const newPage = nextSearch.substr(nextSearch.indexOf('page=') + 5);

    // how many tracks per page?
    const perPage = thisSearch.substr(thisSearch.indexOf('perPage=') + 8);

    // fetch if we have a new query or a new page
    if ((searchId !== this.props.match.params.searchId || (newPage && newPage !== thisPage) || (searchTerm && thisSearchTerm !== searchTerm) || (trackId && thisTrackId !== trackId)) && !this.props.isLoading) {

      Scroll.animateScroll.scrollToTop({ duration: 100 });
      this.props.startAsync();

      if (searchTerm) {
        this.props.searchTracks(deslugify(searchTerm), newPage || DEFAULT_PAGE, perPage || DEFAULT_PER_PAGE); // TODO: get perPage
      } else if (trackId) {
        this.props.fetchTracksSimilar(trackId, newPage || DEFAULT_PAGE, perPage || DEFAULT_PER_PAGE);
      } else {
        this.props.fetchTracks(type, searchId, searchString, newPage || DEFAULT_PAGE, perPage || DEFAULT_PER_PAGE); // TODO: get perPage
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
        <TrackListingViewToggleButtons />
        {tracklistView === 'cards' ?
          <TrackListingCards trackListing={tracks} isLoading={isLoading} />
          :
          <TrackListingTable trackListing={tracks} isLoading={isLoading} isPlaylist={false} page={page} perPage={perPage} />
        }
        <Pager activePage={page} totalPages={totalPages} firstItem={null} lastItem={null} perPage={perPage || DEFAULT_PER_PAGE} />
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