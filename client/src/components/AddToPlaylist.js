import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Popup, Label, List, Button, Icon, Form } from 'semantic-ui-react';
import _ from 'lodash'
import moment from 'moment';

import * as actionCreators from '../actions/ActionCreators';
import ModalView from './ModalView';
import AddToPlaylistForm from './AddNewPlaylistForm';

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
      track: this.props.trackListing.tracks[trackId]
    });

    this.setState({ modalOpen: false })
  }

  handleInputChange = (e) => {
    this.setState({ newPlaylistName: e.target.value });
  }

  render() {
    const isAdded = false;

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
        color={isAdded ? 'blue' : 'grey'}
        animated
      >
        <Button.Content visible>
          <Icon name='numbered list' />
        </Button.Content>
        <Button.Content hidden>Add to Playlist</Button.Content>
      </Button>

    const playlistItems = _.map(this.props.playlistList, playlist => {
      const added = playlist.listOfTracks.includes(this.props.track.id);
      return (
        <List.Item as={added ? '' : 'a'} onClick={() => this.addToPlaylist({ id: playlist.id })} key={playlist.id}>
          {playlist.name} ({Object.keys(playlist.tracks).length})
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
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddToPlaylist);