import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { withRouter } from 'react-router';
import Scroll from 'react-scroll';
import _ from 'lodash';

import { getTracks, clearTracklist } from '../thunks';
import TrackListingGroup from './TrackListingGroup';
import FilterBar from './FilterBar';

class Tracks extends Component {
  componentDidMount() {
    this.fetchTracks(Object.assign({}, this.parseParams(), queryString.parse(this.props.location.search)));
  }

  componentDidUpdate(prevProps) {
    const newSearchParams = queryString.parse(this.props.location.search);
    const prevSearchParams = queryString.parse(prevProps.location.search);

    if (!_.isEqual(prevSearchParams, newSearchParams)) {
      this.fetchTracks(Object.assign({}, this.parseParams(), newSearchParams));
    }
  }

  componentWillUnmount() {
    this.props.clearTracklist();
  }

  parseParams() {
    const { itemType, itemId } = this.props.match.params;
    const extraParams = {};

    switch (itemType) {
      case 'artist':
        extraParams.artistId = itemId;
        break;
      case 'label':
        extraParams.labelId = itemId;
        break;
      default:
        break;
    }
    return extraParams;
  }

  fetchTracks(payload) {
    Scroll.animateScroll.scrollToTop({ duration: 1500 });
    this.props.getTracks(payload);
  }

  render() {
    const { trackListing, genreListing, history, location } = this.props;

    return (
      <Fragment>
        <FilterBar genreListing={genreListing} history={history} location={location} />
        <TrackListingGroup trackListing={trackListing} />
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    trackListing: state.trackListing,
    genreListing: state.genreListing,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getTracks, clearTracklist }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Tracks));
