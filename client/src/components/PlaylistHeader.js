import React from 'react';
import { Header, Icon, Popup } from 'semantic-ui-react';

const PlaylistHeader = ({ playlistName, editHeader, deletePlaylist, clearPlaylist }) => {
  const trashIcon = <Icon link name='trash' size='small' color='red' onClick={deletePlaylist} />
  const clearPlaylistIcon = <Icon link name='delete' size='small' color='red' onClick={clearPlaylist} />

  return (
    <React.Fragment>
      <Header size='huge' textAlign='left' className='tracklistHeader'>
        <span onClick={editHeader} className='pointerCursor'>{playlistName}</span>
        &nbsp;
        <span>
          <Popup size='tiny' content='Clear Playlist' trigger={clearPlaylistIcon} />
        </span>
        <span>
          <Popup size='tiny' content='Delete Playlist' trigger={trashIcon} />
        </span>
      </Header>
    </React.Fragment>
  );
};

export default PlaylistHeader;
