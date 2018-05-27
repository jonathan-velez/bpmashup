import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header, Message, Input } from 'semantic-ui-react';
import Scroll from 'react-scroll';
import Moment from 'moment';

import * as actionCreators from '../actions/ActionCreators';
import TrackListingTable from './TrackListingTable';
import Pager from './Pager';
import PlaylistHeader from './PlaylistHeader';

class PlaylistController extends React.Component {
  playlistId = this.props.match.params.playlistId;
  playlist = this.props.playlistList[this.playlistId];

  state = {
    playlistNameEditMode: false
  }

  componentDidMount() {
    Scroll.animateScroll.scrollToTop({ duration: 100 });

    if (this.playlist) {
      this.props.loadTracks(this.playlist.tracks);
    }
  }

  componentDidUpdate() {
    this.playlistId = this.props.match.params.playlistId;
    this.playlist = this.props.playlistList[this.playlistId];
    
    if (this.state.playlistNameEditMode) {
      this.focus();
    }
  }


  componentWillReceiveProps(nextProps) {
    const { playlistId: newPlaylistId } = nextProps.match.params;
    const { playlistId: currentPlaylistId } = this.props.match.params;

    // which page we loading?
    const { search: nextSearch } = nextProps.location;
    const { search: thisSearch } = this.props.location;

    const thisPage = thisSearch.substr(thisSearch.indexOf('page=') + 5);
    const newPage = nextSearch.substr(nextSearch.indexOf('page=') + 5);

    if (thisPage != newPage) console.log('swapping pages', thisPage, newPage);

    if (currentPlaylistId != newPlaylistId) {
      this.props.loadTracks(this.props.playlistList[newPlaylistId].tracks);
      console.log('time to load new playlist ', this.props.playlistList[newPlaylistId]);
    }

    const currentTrackListLength = Object.keys(this.props.playlistList[currentPlaylistId].tracks).length;
    const newTrackListLength = Object.keys(nextProps.playlistList[newPlaylistId].tracks).length;

    if (currentTrackListLength != newTrackListLength) {
      this.props.loadTracks(nextProps.playlistList[newPlaylistId].tracks);
    }

    if (this.props.playlistList.length != nextProps.playlistList.length) {
      console.log('length of playlist changed')
    }
  }

  callRemoveFromPlaylist = (trackId) => {
    this.props.removeFromPlaylist({ playlistId: this.props.match.params.playlistId, trackId: trackId });
  }

  editPlaylistName = () => {
    this.setState({ playlistNameEditMode: !this.state.playlistNameEditMode });
  }

  handlePlaylistNameChange = evt => {
    this.props.editPlaylistName({
      playlistId: this.playlistId,
      newName: evt.target.value
    });
  }

  handleRef = (c) => {
    this.inputRef = c;
    console.log(c)
  }

  focus = () => {
    this.inputRef.focus();
    // this.inputRef.select();
  }

  render() {
    const { playlistId } = this.props.match.params;
    const playlist = this.props.playlistList[playlistId];

    if (!playlist) {
      return (
        <Message error>
          <Header size='huge'>Invalid Playlist</Header>
          <p>Oops! Looks like this playlist does not exist.</p>
        </Message>
      )
    }

    let { trackListing, isLoading } = this.props;
    const { tracks, metadata } = trackListing;

    return (
      <React.Fragment>
        {this.state.playlistNameEditMode ?
          <Input
            value={playlist.name}
            onChange={this.handlePlaylistNameChange}
            size='huge'
            onBlur={this.editPlaylistName}
            ref={this.handleRef}
          /> :
          <PlaylistHeader playlistName={playlist.name} editHeader={this.editPlaylistName} />
        }
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