import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';

import {
  numOfPlaylists,
  numOfTracksInPlaylists,
  getPlaylistsSortedByAddedDate,
} from '../selectors';
import { slugify } from '../utils/helpers';

class PlaylistDropdownControl extends React.PureComponent {
  render() {
    const { playlistList, playlistCount, tracksInPlaylistsCount } = this.props;
    let playlistItems = '';

    const firstListItem = (
      <Dropdown.Item
        disabled
        text={`${playlistCount} playlists, ${tracksInPlaylistsCount} tracks`}
      />
    );

    if (Array.isArray(playlistList) && playlistList.length > 0) {
      playlistItems = playlistList.map((playlist) => {
        const { name, id } = playlist;
        const url = `/playlist/${slugify(name)}/${id}`;

        return (
          <Dropdown.Item
            text={`${name} (${playlist.trackIds.length})`}
            as={Link}
            to={url}
            key={id}
            value={id}
          />
        );
      });
    }

    return (
      <Dropdown item scrolling text='PLAYLISTS' className='navbar-dropdown'>
        <Dropdown.Menu>
          {firstListItem}
          {playlistItems}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    playlistList: getPlaylistsSortedByAddedDate(state),
    playlistCount: numOfPlaylists(state),
    tracksInPlaylistsCount: numOfTracksInPlaylists(state),
  };
};

export default connect(
  mapStateToProps,
  null,
)(PlaylistDropdownControl);
