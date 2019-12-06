import React from 'react';
import { Header } from 'semantic-ui-react';

const PlaylistHeader = ({ playlistName, editHeader }) => {
  return (
    <React.Fragment>
      <Header size='huge' textAlign='left' className='tracklistHeader'>
        <span onClick={editHeader} className='pointerCursor'>{playlistName}</span>
      </Header>
    </React.Fragment>
  );
};

export default PlaylistHeader;
