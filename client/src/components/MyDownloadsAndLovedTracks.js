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

  componentWillReceiveProps(nextProps) {
    if (_.isEqual(this.props, nextProps)) return;

    const { location, match } = this.props;
    const { downloadedTracks, lovedTracks, trackListing, location: nextLocation, match: nextMatch, noDownloadList, isLoading } = nextProps;
    const { metadata = {} } = trackListing;
    const { count: trackCount = 0 } = metadata;

    // what type of page to render
    const { pageType: thisPageType } = match.params;
    const { pageType: nextPageType } = nextMatch.params;

    // parse query params
    const { search: nextSearch } = nextLocation;
    const { search: thisSearch } = location;
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

    if (((trackCount === 0 && lovedTracks.length > 0) || // if tracks details weren't loaded on mount. usually due to firebase not loaded yet.
      (thisPageType !== nextPageType || thisPage !== newPage || thisPerPage !== newPerPage)) && // if pagination or per page changes or a new page type is called
      !isLoading) {  // ensure there's not already an xhr in progress
      switch (nextPageType) {
        case 'downloads': {
          this.fetchTracks(downloadedTracks, newPage, newPerPage);
          break;
        }
        case 'no-downloads': {
          this.fetchTracks(noDownloadList, newPage, newPerPage);
          break;
        }
        case 'loved-tracks': {
          this.fetchTracks(lovedTracks, newPage, newPerPage);
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

const mapStateToProps = state => {
  return {
    trackListing: state.trackListing,
    downloadedTracks: state.downloadedTracks,
    lovedTracks: state.lovedTracks,
    isLoading: state.isLoading,
    noDownloadList: state.noDownloadList,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({}, { getTracksByIds, clearTracklist }), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MyDownloadsAndLovedTracks));
