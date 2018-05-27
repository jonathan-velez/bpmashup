import React from 'react';
import { Header, Icon } from 'semantic-ui-react';

const PlaylistHeader = ({ playlistName, editHeader }) => {
  return (
    <React.Fragment>
      <Header size='huge'>
        <span>{playlistName}&nbsp;
          <Icon name='pencil' size='small' onClick={editHeader} />
        </span>
      </Header>
    </React.Fragment>
  );
};

export default PlaylistHeader;