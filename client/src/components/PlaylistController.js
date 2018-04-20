import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header, Message } from 'semantic-ui-react';
import Scroll from 'react-scroll';
import Moment from 'moment';

import * as actionCreators from '../actions/ActionCreators';
import TrackListingTable from '../components/TrackListingTable';
import Pager from '../components/Pager';

class PlaylistController extends React.Component {
  playlistId = this.props.match.params.playlistId;
  playlist = this.props.playlistList[this.playlistId];

  componentDidMount() {
    Scroll.animateScroll.scrollToTop({ duration: 100 });
    console.log('mounting playlist', this.playlist);
    this.props.loadTracks(this.playlist.tracks);
  }

  componentWillReceiveProps(nextProps) {
    const { playlistId: newPlaylistId } =  nextProps.match.params;
    const { playlistId: currentPlaylistId } = this.props.match.params;

    // which page we loading?
    const { search: nextSearch } = nextProps.location;
    const { search: thisSearch } = this.props.location;

    const thisPage = thisSearch.substr(thisSearch.indexOf('page=') + 5);
    const newPage = nextSearch.substr(nextSearch.indexOf('page=') + 5);

    if(thisPage != newPage) console.log('swapping pages', thisPage, newPage);

    if (currentPlaylistId != newPlaylistId ) {
      this.props.loadTracks(this.props.playlistList[newPlaylistId].tracks);
      console.log('time to load new playlist ', this.props.playlistList[newPlaylistId]);
    }

    const currentTrackListLength = Object.keys(this.props.playlistList[currentPlaylistId].tracks).length;
    const newTrackListLength = Object.keys(nextProps.playlistList[newPlaylistId].tracks).length;

    if(currentTrackListLength != newTrackListLength) {
      this.props.loadTracks(nextProps.playlistList[newPlaylistId].tracks);
    }

    if (this.props.playlistList.length != nextProps.playlistList.length) {
      console.log('length of playlist changed')
    }
  }
  
  callRemoveFromPlaylist = (trackId) => {
    this.props.removeFromPlaylist({ playlistId: this.props.match.params.playlistId, trackId: trackId });
  }

  render() {
    const { playlistId } = this.props.match.params;
    const playlist = this.props.playlistList[playlistId];

    if (!playlist) return <Header size='huge'>Invalid Playlist</Header>;
    
    let { trackListing, isLoading } = this.props;
    const { tracks, metadata } = trackListing;

    return (
      <React.Fragment>
        <Header size='huge'>{playlist.name}</Header>
        <Message info>
          <Message.Header>Added on</Message.Header>
          <p>{Moment.unix(playlist.dateAdded).format("YYYY-MM-DD - HH:mm a")}</p>
        </Message>
        <TrackListingTable
          trackListing={tracks}
          isLoading={isLoading}
          removeFromPlaylist={this.callRemoveFromPlaylist}
        />
        <Pager activePage={1} perPage={20} totalPages={Math.ceil(Object.keys(tracks).length / 20)} firstItem={null} lastItem={null} />
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    playlistList: state.playlistList,
    trackListing: state.trackListing,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistController);