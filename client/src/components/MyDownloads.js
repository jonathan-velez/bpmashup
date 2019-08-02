import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getTracksByIds } from '../thunks/tracksThunk';
import TrackListingTable from './TrackListingTable';

class MyDownloads extends Component {
  componentDidMount() {
    const { getTracksByIds, downloadedTracks } = this.props;
    if (downloadedTracks.length > 0) {
      getTracksByIds();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { downloadedTracks, trackListing } = nextProps;
    const { tracks } = trackListing;

    if (downloadedTracks.length > 0 && tracks && Object.keys(tracks).length === 0) {
      console.log('fetch tracks');
      this.fetchTracks(downloadedTracks);
    }
  }

  fetchTracks(ids = []) {
    if (ids.length > 0) {
      const { getTracksByIds } = this.props;
      getTracksByIds(ids.join(','));
    }
  }

  render() {
    let { trackListing } = this.props;
    const { tracks } = trackListing;

    return (
      <React.Fragment>
        <TrackListingTable trackListing={tracks} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    trackListing: state.trackListing,
    downloadedTracks: state.downloadedTracks,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({}, { getTracksByIds }), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MyDownloads));
