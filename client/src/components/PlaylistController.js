import React from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header, Message, Form, Input } from 'semantic-ui-react';
import Scroll from 'react-scroll';
import { withRouter } from 'react-router-dom';

import * as actionCreators from '../actions/ActionCreators';
import TrackListingTable from './TrackListingTable';
import PlaylistHeader from './PlaylistHeader';
import * as thunks from '../thunks';

class PlaylistController extends React.Component {
  playlistId = this.props.match.params.playlistId;
  playlist = this.props.playlistList && this.props.playlistList[this.playlistId];

  state = {
    playlistNameEditMode: false,
    deletePlaylist: false,
    playlistName: '',
  }

  componentDidMount() {
    Scroll.animateScroll.scrollToTop({ duration: 100 });

    if (this.playlist) {
      this.props.loadTracks(this.playlist.tracks);
      this.setState({ playlistName: this.playlist.name });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.playlistId = this.props.match.params.playlistId;
    this.playlist = this.props.playlistList && this.props.playlistList[this.playlistId];

    if (!prevState.playlistNameEditMode && this.state.playlistNameEditMode) {
      this.focus();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { playlistId: newPlaylistId } = nextProps.match.params;
    const { playlistId: currentPlaylistId } = this.props.match.params;

    const newPlaylistObj = (nextProps.playlistList && nextProps.playlistList[newPlaylistId]) || {};
    const currentPlaylistObj = (this.props.playlistList && this.props.playlistList[currentPlaylistId]) || {};

    const { tracks: newPlaylistTracks = {} } = newPlaylistObj;
    const { tracks: currentPlaylistTracks = {} } = currentPlaylistObj;

    // handle confirm modal update to delete
    if (nextProps.confirmModal.confirm && this.state.deletePlaylist) {
      this.actuallyDeletePlaylists();
      this.props.resetConfirm();
      return;
    }

    // something new to load
    if (currentPlaylistId && currentPlaylistId !== newPlaylistId && newPlaylistObj) {
      this.props.loadTracks(newPlaylistTracks);
      this.setState({ playlistName: newPlaylistObj.name });
      return;
    }

    // if num of tracks changed, loadTracks again
    if (newPlaylistId && newPlaylistObj && currentPlaylistObj) {
      const currentTrackListLength = Object.keys(currentPlaylistTracks).length;
      const newTrackListLength = Object.keys(newPlaylistTracks).length;

      if (currentTrackListLength && currentTrackListLength !== newTrackListLength) {
        this.props.loadTracks(newPlaylistTracks);
      }
    }
  }

  validatePlaylistName = playlistName => {
    return playlistName.length < 51;
  }

  callRemoveFromPlaylist = (trackId) => {
    this.props.removeFromPlaylist({ playlistId: this.props.match.params.playlistId, trackId: trackId });
  }

  togglePlaylistNameEditMode = () => {
    this.setState({ playlistNameEditMode: !this.state.playlistNameEditMode });
  }

  handlePlaylistNameChange = evt => {
    const playlistName = evt.target.value;

    if (this.validatePlaylistName(playlistName)) {
      this.setState({ playlistName });
    }
  }

  deletePlaylist = () => {
    this.setState({ deletePlaylist: true });

    this.props.openConfirm({
      content: 'Are you sure you want to delete this playlist?',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });
  }

  actuallyDeletePlaylists = () => {
    const { deletePlaylist } = this.state;

    if (deletePlaylist) {
      this.props.deletePlaylist(this.playlistId);
      this.setState({ deletePlaylist: false });
      this.props.history.push(`/`);
    }
  }

  handleRef = (c) => {
    this.inputRef = c;
  }

  focus = () => {
    this.inputRef.focus();
    ReactDOM.findDOMNode(this.inputRef).querySelector('input').select();
  }

  handleFormSubmit = () => {
    this.props.editPlaylistName({
      playlistId: this.playlistId,
      newName: this.state.playlistName
    });

    this.togglePlaylistNameEditMode();
  }

  render() {
    const { playlistId } = this.props.match.params;
    const playlist = this.props.playlistList && this.props.playlistList[playlistId];

    if (!playlist) {
      return (
        <Message error>
          <Header size='huge'>Invalid Playlist</Header>
          <p>Oops! Looks like this playlist does not exist.</p>
        </Message>
      )
    }

    let { trackListing, isLoading } = this.props;
    const { tracks } = trackListing;

    return (
      <React.Fragment>
        {this.state.playlistNameEditMode ?
          <Form onSubmit={this.handleFormSubmit} className='playlistEditInput'>
            <Input
              value={this.state.playlistName}
              onChange={this.handlePlaylistNameChange}
              size='massive' //TODO: Style this to be the same as the header
              onBlur={this.handleFormSubmit}
              ref={this.handleRef}
              fluid
              transparent
            />
          </Form> :
          <PlaylistHeader playlistName={playlist.name} editHeader={this.togglePlaylistNameEditMode} deletePlaylist={this.deletePlaylist} />
        }
        <TrackListingTable
          trackListing={tracks}
          isLoading={isLoading}
          removeFromPlaylist={this.callRemoveFromPlaylist}
          isPlaylist
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    playlistList: state.playlistList,
    trackListing: state.trackListing,
    confirmModal: state.confirmModal,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({}, actionCreators, thunks), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PlaylistController));
