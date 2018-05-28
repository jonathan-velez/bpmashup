import React from 'react';
import { Header, Icon } from 'semantic-ui-react';

const PlaylistHeader = ({ playlistName, editHeader, deletePlaylist }) => {
  return (
    <React.Fragment>
      <Header size='huge'>
        <span onClick={editHeader} className='pointerCursor'>{playlistName}</span>
        &nbsp;
        <span><Icon name='delete' size='small' color='red' className='pointerCursor' onClick={deletePlaylist} /></span>
      </Header>
    </React.Fragment>
  );
};

export default PlaylistHeader;
