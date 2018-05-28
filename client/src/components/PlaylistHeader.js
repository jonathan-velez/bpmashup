import React from 'react';
import { Header, Icon } from 'semantic-ui-react';

const PlaylistHeader = ({ playlistName, editHeader, deletePlaylist }) => {
  return (
    <React.Fragment>
      <Header size='huge'>
        <span>{playlistName}&nbsp;
          <Icon name='pencil' size='small' onClick={editHeader} />
          &nbsp;
          <Icon name='delete' size='small' onClick={deletePlaylist} />
        </span>
      </Header>
    </React.Fragment>
  );
};

export default PlaylistHeader;