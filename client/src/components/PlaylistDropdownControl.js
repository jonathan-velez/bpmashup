import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';

class PlaylistDropdownControl extends React.Component {
  render() {
    if (Object.keys(this.props.playlistList).length > 0) {
      this.playlistList = _.map(this.props.playlistList, playlist => {
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
    } else {
      this.playlistList = '';
    }

    return (
      <Dropdown
        item
        scrolling
        text='Playlists'
      >
        <Dropdown.Menu>
          {this.playlistList}
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

const mapStateToProps = state => {
  return {
    playlistList: state.playlistList
  }
}

export default connect(mapStateToProps, null)(PlaylistDropdownControl);