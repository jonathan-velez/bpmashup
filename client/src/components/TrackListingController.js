import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import { Header } from 'semantic-ui-react';

import * as actionCreators from '../actions/ActionCreators';
import TrackListingCards from '../components/TrackListingCards';
import { deslugify } from '../utils/helpers';
import Pager from '../components/Pager';

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 20;

class TrackListingController extends React.Component {
  // TODO: Dry cdm and cwrp up. Maybe use the constructor
  componentDidMount() {
    const { type, searchId, searchString, searchTerm } = this.props.match.params; // TODO: reduce ambiguity between search vars
    const { search: thisSearch } = this.props.location;
    const thisPage = thisSearch.substr(thisSearch.indexOf('page=') + 5) || DEFAULT_PAGE;

    Scroll.animateScroll.scrollToTop({ duration: 100 });
    this.props.startAsync();

    // determine if it's a search page or not
    if (searchTerm) {
      this.props.searchTracks(deslugify(searchTerm));
    } else {
      this.props.fetchTracks(type, searchId, searchString, thisPage, DEFAULT_PER_PAGE);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { type, searchId, searchString, searchTerm } = nextProps.match.params;
    const { search: nextSearch } = nextProps.location;
    const { search: thisSearch } = this.props.location;
    const { searchTerm: thisSearchTerm } = this.props.match.params;

    // which page we loading?
    const thisPage = thisSearch.substr(thisSearch.indexOf('page=') + 5);
    const newPage = nextSearch.substr(nextSearch.indexOf('page=') + 5);

    // how many per page?
    // const thisPerPage = thisSearch.substr

    // fetch if we have a new query or a new page
    if ((searchId !== this.props.match.params.searchId || (newPage && newPage !== thisPage) || (searchTerm && thisSearchTerm !== searchTerm)) && !this.props.isLoading) {

      Scroll.animateScroll.scrollToTop({ duration: 100 });
      this.props.startAsync();

      if (searchTerm) {
        this.props.searchTracks(deslugify(searchTerm), newPage || DEFAULT_PAGE, DEFAULT_PER_PAGE); // TODO: get perPage
      } else {
        this.props.fetchTracks(type, searchId, searchString, newPage || DEFAULT_PAGE, DEFAULT_PER_PAGE); // TODO: get perPage
      }
    }
  }

  render() {
    let { trackListing, isLoading } = this.props;
    const { tracks, metadata } = trackListing;

    const { totalPages, page, perPage } = metadata;

    return (
      <React.Fragment>
        <Header size='huge'>{deslugify(this.props.match.params.searchString || this.props.match.params.searchTerm || 'Top 100 Tracks').toUpperCase()}</Header>
        <TrackListingCards trackListing={tracks} isLoading={isLoading} />
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