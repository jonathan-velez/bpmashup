import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Scroll from 'react-scroll';
import _ from 'lodash';

import TracklistingHeader from './TracklistingHeader';
import TrackListingGroup from './TrackListingGroup';
import NothingHereMessage from './NothingHereMessage';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '../constants/defaults';
import { getTracksByIds, clearTracklist } from '../thunks';

class MyDownloadsAndLovedTracks extends Component {
  componentDidMount() {
    const { match, downloadedTracks, lovedTracks, noDownloadList } = this.props;
    const { pageType } = match.params;

    if (pageType === 'downloads') {
      if (downloadedTracks.length > 0) {
        this.fetchTracks(downloadedTracks);
      }
    } else if (pageType === 'no-downloads') {
      if (noDownloadList.length > 0) {
        this.fetchTracks(noDownloadList);
      }
    } else {
      if (lovedTracks.length > 0) {
        this.fetchTracks(lovedTracks);
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (_.isEqual(this.props, prevProps)) return;

    const {
      location: thisLocation,
      match: thisMatch,
      downloadedTracks: thisDownloadedTracks = [],
      lovedTracks: thisLovedTracks = [],
      trackListing: thisTrackListing = {},
      noDownloadList: thisNoDownloadList = [],
      isLoading: thisIsLoading = false,
    } = this.props;
    const {
      location: prevLocation = {},
      match: prevMatch = {},
    } = prevProps;

    const { metadata = {} } = thisTrackListing;
    const { count: trackCount = 0 } = metadata;

    // what type of page to render
    const { pageType: thisPageType } = thisMatch.params;
    const { pageType: prevPageType } = prevMatch.params;

    // parse query params
    const { search: thisSearch } = thisLocation;
    const { search: prevSearch } = prevLocation;
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

    if (((trackCount === 0 && (thisLovedTracks.length > 0 || thisDownloadedTracks.length > 0 || thisNoDownloadList.length > 0)) || // if tracks details weren't loaded on mount. usually due to firebase not loaded yet.
      (thisPageType !== prevPageType || thisPage !== prevPage || thisPerPage !== prevPerPage)) && // if pagination or per page changes or a new page type is called
      !thisIsLoading) {  // ensure there's not already an xhr in progress
      switch (thisPageType) {
        case 'downloads': {
          this.fetchTracks(thisDownloadedTracks, thisPage, thisPerPage);
          break;
        }
        case 'no-downloads': {
          this.fetchTracks(thisNoDownloadList, thisPage, thisPerPage);
          break;
        }
        case 'loved-tracks': {
          this.fetchTracks(thisLovedTracks, thisPage, thisPerPage);
          break;
        }
        default:
          break;
      }
    }
  }

  componentWillUnmount() {
    this.props.clearTracklist();
  }

  fetchTracks(ids = [], page, perPage) {
    if (Array.isArray(ids) && ids.length > 0) {
      const { getTracksByIds } = this.props;
      Scroll.animateScroll.scrollToTop({ duration: 1000 });
      getTracksByIds(ids.join(','), page, perPage);
    }
  }

  render() {
    const { match, trackListing } = this.props;
    const { metadata = {} } = trackListing;
    const { count: trackCount = 0 } = metadata;
    const { pageType } = match.params;

    if (trackCount === 0) {
      return <NothingHereMessage />
    }

    let headerTitle = '';

    switch (pageType) {
      case 'downloads':
        headerTitle = 'My Downloads'
        break;
      case 'no-downloads':
        headerTitle = 'No Downloads Found'
        break;
      case 'loved-tracks':
        headerTitle = 'My Loved Tracks'
        break;
      default:
        headerTitle = '';
    }

    return (
      <React.Fragment>
        <TracklistingHeader headerTitle={headerTitle} />
        <TrackListingGroup trackListing={trackListing} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { match } = ownProps;
  const { params } = match;
  const { pageType } = params;

  return {
    isLoading: state.isLoading,
    trackListing: state.trackListing,
    ...(pageType === 'downloads' && { downloadedTracks: state.downloadedTracks }),
    ...(pageType === 'loved-tracks' && { lovedTracks: state.lovedTracks }),
    ...(pageType === 'no-downloads' && { noDownloadList: state.noDownloadList }),
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getTracksByIds, clearTracklist }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MyDownloadsAndLovedTracks));
