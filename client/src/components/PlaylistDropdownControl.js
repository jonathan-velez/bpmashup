import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';

const PlaylistDropdownControl = ({ playlistList }) => {
  this.playlistItems = '';

  if (playlistList && Object.keys(playlistList).length > 0) {
    this.playlistItems = _.map(playlistList, playlist => {
      const { name, id } = playlist;
      const url = `/playlist/${id}`;

      return (
        <Dropdown.Item
          text={name}
          as={Link}
          to={url}
          key={id}
          value={id}
        />
      )
    });
  }

  return (
    <Dropdown
      item
      scrolling
      text='Playlists'
    >
      <Dropdown.Menu>
        {this.playlistItems}
      </Dropdown.Menu>
    </Dropdown>
  )
}

const mapStateToProps = state => {
  return {
    playlistList: state.playlistList
  }
}

export default connect(mapStateToProps, null)(PlaylistDropdownControl);
