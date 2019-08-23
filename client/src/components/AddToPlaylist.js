import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Popup, List, Button, Icon, Checkbox, Dropdown } from 'semantic-ui-react';
import _ from 'lodash'
import moment from 'moment';

import ModalView from './ModalView';
import AddToPlaylistForm from './AddNewPlaylistForm';
import * as actionCreators from '../actions/ActionCreators';
import * as thunks from '../thunks';
import { getAllPlaylistsTrackCount, getPlaylistCount } from '../utils/playlistUtils';

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

    if (playlist.added) {
      this.props.removeFromPlaylist({
        playlistId: playlist.id,
        trackId: track.id.toString(),
      });
    } else {
      this.props.addToPlaylist({
        playlist,
        track
      });
    }
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
      if (playlist.listOfTracks && playlist.listOfTracks.includes(this.props.track.id)) {
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

    const playlistIcon = <Icon name='numbered list' color={isAdded ? 'red' : 'grey'} title={isAdded ? 'Add to another playlist' : 'Add to a playlist'} />
    const playlistButton =
      <Button basic>
        <Button.Content visible>
          {playlistIcon}
        </Button.Content>
      </Button>

    const playlistDropdownItem = <Dropdown.Item>{playlistIcon}Playlists</Dropdown.Item>

    const playlistItems = _.map(_.sortBy(this.props.playlistList, 'dateAdded'), playlist => {
      const added = playlist.listOfTracks && playlist.listOfTracks.includes(this.props.track.id);
      const { tracks = {} } = playlist;

      return (
        <List.Item key={playlist.id}>
          <List.Content floated='right'>
            <Checkbox onClick={() => this.addToPlaylist({ id: playlist.id, added })} checked={added} />
          </List.Content>
          <List.Content className={added ? 'boldedText' : ''}>{playlist.name} ({Object.keys(tracks).length})</List.Content>
        </List.Item>
      )
    });

    const playlistButtonContent =
      <List divided relaxed verticalAlign='middle'>
        {playlistItems}
        <List.Item>
          <Button
            size='mini'
            fluid
            icon='add'
            labelPosition='left'
            content='New Playlist'
            onClick={this.addNewPlaylist}
          />
        </List.Item>
      </List>

    return (
      <Popup
        header={`${getPlaylistCount(this.props.playlistList)} playlists, ${getAllPlaylistsTrackCount(this.props.playlistList)} tracks`}
        trigger={this.props.type === 'dropdownItem' ? playlistDropdownItem : playlistButton}
        content={playlistButtonContent}
        on='click'
        onClick={(e) => e.stopPropagation()}
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
