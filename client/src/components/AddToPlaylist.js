import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Popup, Label, List, Button, Icon } from 'semantic-ui-react';
import _ from 'lodash'
import moment from 'moment';

import ModalView from './ModalView';
import AddToPlaylistForm from './AddNewPlaylistForm';
import * as actionCreators from '../actions/ActionCreators';
import * as thunks from '../thunks';

class AddToPlaylist extends React.Component {
  state = {
    popupOpen: false,
    modalOpen: false,
    newPlaylistName: ''
  }

  addToPlaylist = (playlist) => {
    const timeStamp = moment().unix();
    const track = Object.assign({}, this.props.track, {
      timeStamp
    })

    this.props.addToPlaylist({
      playlist,
      track
    });
    this.setState({ popupOpen: false })
  }

  addNewPlaylist = () => {
    this.setState({ popupOpen: false, modalOpen: true })
  }

  handlePopupOpen = () => {
    this.setState({ popupOpen: true });
  }

  handlePopupClose = () => {
    this.setState({ popupOpen: false });
  }

  handleModalClose = () => {
    this.setState({ modalOpen: false })
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const timeStamp = moment().unix();
    const trackId = this.props.track.id
    const track = Object.assign({}, this.props.trackListing.tracks[trackId], {
      timeStamp
    })

    this.props.addNewPlaylist({
      name: this.state.newPlaylistName,
      track
    });

    this.setState({ modalOpen: false })
  }

  handleInputChange = (e) => {
    this.setState({ newPlaylistName: e.target.value });
  }

  render() {
    let isAdded = false;

    _.mapValues(this.props.playlistList, playlist => {
      if (playlist.listOfTracks.includes(this.props.track.id)) {
        isAdded = true;
        return;
      }
    })

    if (this.state.modalOpen) {
      return (
        <ModalView
          headerIcon={'write'}
          open={this.state.modalOpen}
          handleClose={this.handleModalClose}
          modalHeader='New Playlist'
          modalContent={<AddToPlaylistForm newPlaylistName={this.state.newPlaylistName} handleInputChange={this.handleInputChange} handleSubmit={this.handleSubmit} />}
        />
      )
    }

    const playlistButton =
      <Button
        basic={!isAdded}
        color={isAdded ? 'grey' : 'blue'}
        animated
      >
        <Button.Content visible>
          <Icon name='numbered list' />
        </Button.Content>
        <Button.Content hidden>Add to Playlist</Button.Content>
      </Button>

    const playlistItems = _.map(this.props.playlistList, playlist => {
      const added = playlist.listOfTracks.includes(this.props.track.id);
      const { tracks = {} } = playlist;

      return (
        <List.Item as={added ? '' : 'a'} onClick={() => this.addToPlaylist({ id: playlist.id })} key={playlist.id}>
          {playlist.name} ({Object.keys(tracks).length})
        </List.Item>
      )
    });

    const playlistButtonContent =
      <List divided relaxed verticalAlign='middle'>
        {playlistItems}
        <List.Item onClick={this.addNewPlaylist} className='new-playlist-icon'>
          <Label>
            <Icon name='add' /> New Playlist
            </Label>
        </List.Item>
      </List>

    return (
      <Popup
        trigger={playlistButton}
        content={playlistButtonContent}
        on='click'
        position='bottom center'
        open={this.state.popupOpen}
        onOpen={this.handlePopupOpen}
        onClose={this.handlePopupClose}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    playlistList: state.playlistList,
    trackListing: state.trackListing
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({}, actionCreators, thunks), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddToPlaylist);