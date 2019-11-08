import React from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Form,
  Input,
  Label,
  Menu,
  Statistic,
  Icon,
} from 'semantic-ui-react';
import Scroll from 'react-scroll';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { v4 } from 'node-uuid'

import {
  loadTracks,
  openConfirm,
  resetConfirm,
} from '../actions/ActionCreators';
import TrackListingTable from './TrackListingTable';
import PlaylistHeader from './PlaylistHeader';
import NothingHereMessage from './NothingHereMessage';
import {
  removeFromPlaylist,
  clearPlaylist,
  deletePlaylist,
  editPlaylistName
} from '../thunks';
import {
  getPlaylistGenreCount,
  getPlaylistTrackCount,
} from '../selectors';

class PlaylistController extends React.Component {
  playlistId = this.props.match.params.playlistId;
  playlist = this.props.playlistList && this.props.playlistList[this.playlistId];

  state = {
    playlistNameEditMode: false,
    deletePlaylist: false,
    clearPlaylist: false,
    playlistName: '',
    selectedGenreFilters: {},
    filteredTrackListing: {},
  }

  componentDidMount() {
    Scroll.animateScroll.scrollToTop({ duration: 100 });

    if (this.playlist) {
      this.props.loadTracks(this.playlist.tracks);
      this.setState({
        ...this.state,
        playlistName: this.playlist.name,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.playlistId = this.props.match.params.playlistId;
    this.playlist = this.props.playlistList && this.props.playlistList[this.playlistId];

    if (!this.state.playlistName && this.playlist && this.playlist.tracks) {
      this.setState({
        ...this.state,
        playlistName: this.playlist.name,
        filteredTrackListing: {},
        selectedGenreFilters: {},
      });
      this.props.loadTracks(this.playlist.tracks);
    }

    if (!prevState.playlistNameEditMode && this.state.playlistNameEditMode) {
      this.focus();
    }

    if (!_.isEqual(this.state.selectedGenreFilters, prevState.selectedGenreFilters)) {
      this.filterGenres();
    }

    // TODO: Figure out why clearing a playlist doesn't refresh the now empty playlist.
    const { playlistId: prevPlaylistId } = prevProps.match.params;
    const { playlistId: thisPlaylistId } = this.props.match.params;

    const prevPlaylistObj = (prevProps.playlistList && prevProps.playlistList[prevPlaylistId]) || {};
    const thisPlaylistObj = (this.props.playlistList && this.props.playlistList[thisPlaylistId]) || {};

    const { tracks: prevPlaylistTracks = {} } = prevPlaylistObj;
    const { tracks: thisPlaylistTracks = {} } = thisPlaylistObj;

    // handle confirm modal update to delete
    if (this.props.confirmModal.confirm && this.state.deletePlaylist) {
      this.actuallyDeletePlaylists();
      this.props.resetConfirm();
      return;
    }

    // handle confirm modal update to clear playlist
    if (this.props.confirmModal.confirm && this.state.clearPlaylist) {
      this.actuallyClearPlaylist();
      this.props.resetConfirm();
      return;
    }

    // something new to load
    if (thisPlaylistId && thisPlaylistId !== prevPlaylistId && thisPlaylistObj) {
      this.setState({
        ...this.state,
        playlistName: thisPlaylistObj.name,
        filteredTrackListing: {},
        selectedGenreFilters: {},
      });
      this.props.loadTracks(thisPlaylistTracks);
      return;
    }

    // if num of tracks changed, loadTracks again
    if (thisPlaylistId && thisPlaylistObj && prevPlaylistObj) {
      const thisTrackListLength = Object.keys(thisPlaylistTracks).length;
      const prevTrackListLength = Object.keys(prevPlaylistTracks).length;

      if (thisTrackListLength !== prevTrackListLength) {
        this.props.loadTracks(thisPlaylistTracks);
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
    this.setState({
      ...this.state,
      playlistNameEditMode: !this.state.playlistNameEditMode,
    });
  }

  handlePlaylistNameChange = evt => {
    const playlistName = evt.target.value;

    if (this.validatePlaylistName(playlistName)) {
      this.setState({
        ...this.state,
        playlistName,
      });
    }
  }

  deletePlaylist = () => {
    this.setState({
      ...this.state,
      deletePlaylist: true,
    });

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
      this.setState({
        ...this.state,
        deletePlaylist: false,
      });
      this.props.history.push(`/`);
    }
  }

  clearPlaylist = () => {
    this.setState({ clearPlaylist: true });

    this.props.openConfirm({
      content: 'Are you sure you want to clear this playlist?',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });
  }

  actuallyClearPlaylist = () => {
    const { clearPlaylist } = this.state;

    if (clearPlaylist) {
      this.props.clearPlaylist(this.playlistId);
      this.setState({
        ...this.state,
        clearPlaylist: false,
      });
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

  handleSelectGenreFilter = genreId => {
    this.setState({
      ...this.state,
      selectedGenreFilters: {
        ...this.state.selectedGenreFilters,
        [genreId]: !this.state.selectedGenreFilters[genreId],
      }
    })
  }

  filterGenres = () => {
    const { selectedGenreFilters } = this.state;
    const { trackListing } = this.props;
    const { tracks } = trackListing;
    const selectedGenreFiltersIds = Object.keys(selectedGenreFilters);

    if (selectedGenreFiltersIds.length === 0 || !trackListing) return;

    const selectedGenreFiltersArray = selectedGenreFiltersIds.filter(genre => selectedGenreFilters[genre]);
    if (selectedGenreFiltersArray.length === 0) {
      this.setState({
        ...this.state,
        filteredTrackListing: {},
      })

      return;
    }

    const newTracks = {};
    const trackIds = Object.keys(tracks);

    trackIds.forEach(trackId => {
      if (Array.isArray(tracks[trackId].genres) && tracks[trackId].genres.some(genre => selectedGenreFiltersArray.includes(genre.id.toString()))) {
        newTracks[trackId] = tracks[trackId];
      }
    })

    const filteredTrackListing = {
      ...trackListing,
      tracks: newTracks,
    }

    this.setState({
      ...this.state,
      filteredTrackListing,
    })
  }

  handleClearGenreFilter = () => {
    this.setState({
      ...this.state,
      filteredTrackListing: {},
      selectedGenreFilters: {},
    })
  }

  render() {
    const { playlistList, playlistGenreCount, match, trackListing, isLoading, playlistTrackCount } = this.props;
    const { filteredTrackListing, selectedGenreFilters } = this.state;
    const { playlistId } = match.params;
    const playlist = playlistList && playlistList[playlistId];
    const selectedGenreFiltersIds = Object.keys(selectedGenreFilters).filter(genreId => selectedGenreFilters[genreId]);

    if (!playlist) return <NothingHereMessage />

    const { tracks } = Object.keys(filteredTrackListing).length > 0 ? filteredTrackListing : trackListing;

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
          <PlaylistHeader
            playlistName={playlist.name}
            editHeader={this.togglePlaylistNameEditMode}
            deletePlaylist={this.deletePlaylist}
            clearPlaylist={this.clearPlaylist}
          />
        }
        <Statistic.Group size='mini'>
          <Statistic>
            <Statistic.Value>{playlistTrackCount}</Statistic.Value>
            <Statistic.Label>{`Track${playlistTrackCount > 1 ? 's' : ''}`} </Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>{Object.keys(playlistGenreCount).length}</Statistic.Value>
            <Statistic.Label>{`Genre${Object.keys(playlistGenreCount).length > 1 ? 's' : ''}`} </Statistic.Label>
          </Statistic>
        </Statistic.Group>
        <Menu>
          <Menu.Item header>Genres</Menu.Item>
          {playlistGenreCount && Object.keys(playlistGenreCount).map(genreId => {
            const genre = playlistGenreCount[genreId];

            return (
              <Menu.Item
                key={genreId}
                active={selectedGenreFiltersIds.includes(genreId)}
                onClick={() => this.handleSelectGenreFilter(genreId)}>
                {genre.name}
                <Label
                  floating
                  size='mini'
                  color='black'>
                  {genre.count}
                </Label>
              </Menu.Item>
            )
          })}
          {selectedGenreFiltersIds.length > 0 && <Menu.Item as='a' onClick={this.handleClearGenreFilter}><Icon name='delete' />Clear Filter</Menu.Item>}
        </Menu>
        <TrackListingTable
          key={v4()}
          trackListing={tracks}
          isLoading={isLoading}
          removeFromPlaylist={this.callRemoveFromPlaylist}
          isPlaylist
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    playlistList: state.playlistList,
    trackListing: state.trackListing,
    confirmModal: state.confirmModal,
    playlistGenreCount: getPlaylistGenreCount(state, props),
    playlistTrackCount: getPlaylistTrackCount(state, props),
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    loadTracks,
    openConfirm,
    removeFromPlaylist,
    clearPlaylist,
    deletePlaylist,
    editPlaylistName,
    resetConfirm
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PlaylistController));
