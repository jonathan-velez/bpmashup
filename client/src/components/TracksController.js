import React, { Fragment, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { withRouter } from 'react-router';
import Scroll from 'react-scroll';

import { getTracks, clearTracklist } from '../thunks';
import TrackListingGroup from './TrackListingGroup';
import FilterBar from './FilterBar';

const Tracks = ({ match, history, location, trackListing, genreListing, clearTracklist, getTracks }) => {
  useEffect(() => {
    fetchTracks(Object.assign({}, parseParams(), queryString.parse(location.search)));

    return clearTracklist();
  }, [location.search]);

  const parseParams = () => {
    const { itemType, itemId } = match.params;
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

  const fetchTracks = (payload) => {
    Scroll.animateScroll.scrollToTop({ duration: 1500 });
    getTracks(payload);
  }

  return (
    <Fragment>
      <FilterBar genreListing={genreListing} history={history} location={location} />
      <TrackListingGroup trackListing={trackListing} />
    </Fragment>
  );

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
