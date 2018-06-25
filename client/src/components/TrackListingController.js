import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import _ from 'lodash';
import { Dropdown } from 'semantic-ui-react';

import * as actionCreators from '../actions/ActionCreators';
import { deslugify, musicalKeyFilter } from '../utils/helpers';
import TrackListingCards from './TrackListingCards';
import TracklistingHeader from './TracklistingHeader';
import Pager from './Pager';
import * as thunks from '../thunks';

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 100;

class TrackListingController extends React.Component {
  // TODO: Dry cdm and cwrp up. Maybe use the constructor
  componentDidMount() {
    const { type, searchId, searchString, searchTerm, trackId } = this.props.match.params; // TODO: reduce ambiguity between search vars
    const { search: thisSearch } = this.props.location;
    const thisPage = thisSearch.substr(thisSearch.indexOf('page=') + 5) || DEFAULT_PAGE;

    Scroll.animateScroll.scrollToTop({ duration: 100 });
    this.props.startAsync();

    // determine if it's a search page, similar tracks or not
    if (searchTerm) {
      this.props.searchTracks(deslugify(searchTerm));
    } else if (trackId) {
      this.props.fetchTracksSimilar(trackId);
    } else {
      this.props.fetchTracks(type, searchId, searchString, thisPage, DEFAULT_PER_PAGE);
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

    // fetch if we have a new query or a new page
    if ((searchId !== this.props.match.params.searchId || (newPage && newPage !== thisPage) || (searchTerm && thisSearchTerm !== searchTerm) || (trackId && thisTrackId !== trackId)) && !this.props.isLoading) {

      Scroll.animateScroll.scrollToTop({ duration: 100 });
      this.props.startAsync();

      if (searchTerm) {
        this.props.searchTracks(deslugify(searchTerm), newPage || DEFAULT_PAGE, DEFAULT_PER_PAGE); // TODO: get perPage
      } else if (trackId) {
        this.props.fetchTracksSimilar(trackId, newPage || DEFAULT_PAGE, DEFAULT_PER_PAGE);
      } else {
        this.props.fetchTracks(type, searchId, searchString, newPage || DEFAULT_PAGE, DEFAULT_PER_PAGE); // TODO: get perPage
      }
    }
  }

  filterKey = (e, { value }) => {
    this.props.filterTracks({
      filterBy: 'musicalKey',
      filterValue: value
    });
  }

  filterLabel = (e, { value }) => {
    this.props.filterTracks({
      filterBy: 'label',
      filterValue: value
    });
  }

  render() {
    const { trackListing, isLoading, match } = this.props;
    const { tracks, filteredTracks, metadata } = trackListing;
    const { totalPages, page, perPage } = metadata;
    const { url, params } = match;

    const pageName = url.split('/')[1];
    let headerTitle = '';
    let headerPrefix = '';

    const orderedTracks = _.sortBy(filteredTracks ? filteredTracks : tracks, 'position');

    // const uniqueKeysArray = [];

    // const uniqueKeys = [...new Set(orderedTracks.map(track => track.key && track.key.shortName))];

    // uniqueKeys.forEach(key => {
    //   const uniqueKeysObject = {};
    //   uniqueKeysObject.shortName = key;
    //   uniqueKeysObject.camelotName = musicalKeyFilter(key);
    //   uniqueKeysObject.camelotNameNumber = +musicalKeyFilter(key).replace(/\D/g, '');
    //   uniqueKeysObject.camelotNameLetter = musicalKeyFilter(key).replace(/\d+/g, '');

    //   uniqueKeysArray.push(uniqueKeysObject);
    // })

    // const sortedFinal = _.orderBy(uniqueKeysArray, [
    //   (key) => key.camelotNameNumber,
    //   (key) => key.camelotNameLetter,
    // ])

    const musicalKeyItems = this.props.trackListing.listOfKeys && this.props.trackListing.listOfKeys.map((key, idx) => {
      return (
        <Dropdown.Item
          key={idx}
          value={key.shortName}
          onClick={this.filterKey}
        >
          {key.camelotName}
        </Dropdown.Item>
      )
    })

    const labelsItems = this.props.trackListing.listOfLabels && this.props.trackListing.listOfLabels.map((label, idx) => {
      return (
        <Dropdown.Item
          key={idx}
          value={label}
          onClick={this.filterLabel}
        >
          {label}
        </Dropdown.Item>
      )
    })

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
        <Dropdown
          item
          text="Key"
        >
          <Dropdown.Menu>
            {musicalKeyItems}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown
          item
          text="Label"
        >
          <Dropdown.Menu>
            {labelsItems}
          </Dropdown.Menu>
        </Dropdown>


        <TracklistingHeader headerPrefix={headerPrefix} headerTitle={headerTitle} />
        <TrackListingCards trackListing={orderedTracks} isLoading={isLoading} />
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
  return bindActionCreators(Object.assign({}, actionCreators, thunks), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackListingController);