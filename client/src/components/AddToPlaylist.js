import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Popup,
  List,
  Button,
  Icon,
  Menu,
} from 'semantic-ui-react';
import moment from 'moment';

import ModalView from './ModalView';
import AddToPlaylistForm from './AddNewPlaylistForm';
import PlaylistListItems from './PlaylistListItems';
import {
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  addNewPlaylist,
} from '../thunks';
import {
  listOfTracksAddedToPlaylist,
  listOfPlaylists,
  numOfPlaylists,
  numOfTracksInPlaylists,
  getPlaylistsSortedByAddedDate,
} from '../selectors';

class AddToPlaylist extends React.PureComponent {
  state = {
    popupOpen: false,
    modalOpen: false,
    newPlaylistName: '',
  };

  handleAddToPlaylist = (playlist) => {
    if (this.props.clickCallback) {
      setTimeout(() => {
        this.props.clickCallback();
      }, 100);
    }
    const timeStamp = moment().unix();
    const track = Object.assign({}, this.props.track, {
      timeStamp,
    });

    if (playlist.added) {
      this.props.removeTrackFromPlaylist({
        playlistId: playlist.id,
        trackId: track.id.toString(),
      });
    } else {
      this.props.addTrackToPlaylist({
        playlistId: playlist.id,
        track,
      });
    }
  };

  handleAddNewPlaylist = () => {
    this.setState({ popupOpen: false, modalOpen: true });
  };

  handlePopupOpen = () => {
    this.setState({ popupOpen: true });
  };

  handlePopupClose = () => {
    this.setState({ popupOpen: false });
  };

  handleModalClose = () => {
    this.setState({ modalOpen: false });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const timeStamp = moment().unix();

    this.props.addNewPlaylist({
      name: this.state.newPlaylistName,
      track: {
        ...this.props.track,
        timeStamp,
      },
    });

    this.setState({ modalOpen: false });

    setTimeout(() => {
      if (this.props.clickCallback) {
        this.props.clickCallback();
      }
    }, 100);
  };

  handleInputChange = (e) => {
    this.setState({ newPlaylistName: e.target.value });
  };

  render() {
    const {
      tracksInPlaylist,
      track,
      playlistList,
      type,
      playlistCount,
      tracksInPlaylistsCount,
    } = this.props;
    const { modalOpen, newPlaylistName } = this.state;
    const isAdded = tracksInPlaylist.includes(track.id);

    if (modalOpen) {
      return (
        <ModalView
          headerIcon={'write'}
          open={modalOpen}
          handleClose={this.handleModalClose}
          modalHeader='New Playlist'
          modalContent={
            <AddToPlaylistForm
              newPlaylistName={newPlaylistName}
              handleInputChange={this.handleInputChange}
              handleSubmit={this.handleSubmit}
            />
          }
        />
      );
    }

    const playlistIcon = (
      <Icon
        name='numbered list'
        color={isAdded ? 'red' : 'grey'}
        title={isAdded ? 'Add to another playlist' : 'Add to a playlist'}
      />
    );
    const playlistButton = (
      <Button basic>
        <Button.Content visible>{playlistIcon}</Button.Content>
      </Button>
    );

    const playlistDropdownItem = <Menu.Item>{playlistIcon}Playlists</Menu.Item>;

    const playlistButtonContent = (
      <List divided relaxed verticalAlign='middle'>
        <PlaylistListItems
          playlistList={playlistList}
          track={track}
          addTrackToPlaylist={this.handleAddToPlaylist}
        />
        <List.Item>
          <Button
            size='mini'
            fluid
            icon='add'
            labelPosition='left'
            content='New Playlist'
            onClick={this.handleAddNewPlaylist}
          />
        </List.Item>
      </List>
    );

    return (
      <Popup
        header={`${playlistCount} playlists, ${tracksInPlaylistsCount} tracks`}
        trigger={
          type === 'dropdownItem' ? playlistDropdownItem : playlistButton
        }
        content={playlistButtonContent}
        on='click'
        position='bottom center'
        open={this.state.popupOpen}
        onOpen={this.handlePopupOpen}
        onClose={this.handlePopupClose}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    playlistList: getPlaylistsSortedByAddedDate(state),
    tracksInPlaylist: listOfTracksAddedToPlaylist(state),
    playlistNames: listOfPlaylists(state),
    playlistCount: numOfPlaylists(state),
    tracksInPlaylistsCount: numOfTracksInPlaylists(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { addTrackToPlaylist, removeTrackFromPlaylist, addNewPlaylist },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddToPlaylist);
