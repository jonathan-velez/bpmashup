import React from 'react';
import { connect } from 'react-redux';
import { Icon, Label } from 'semantic-ui-react';

import ConfirmAction from './ConfirmAction';
import { clearPlaylist } from '../thunks';

const ClearPlaylist = ({ playlistId, clearPlaylist }) => {
  const handleClearPlaylist = () => {
    if (playlistId) {
      clearPlaylist(playlistId);
    } else {
      throw new Error('Error clearing playlist. Missing playlist ID.');
    }
  }

  return (
    <ConfirmAction
      action={handleClearPlaylist}
      confirmText='Clear playlist? This cannot be reversed.'
      render={confirm => {
        return (
          <Label as='a' onClick={confirm}>
            <Icon link name='eraser' size='large' color='black' />
            Clear playlist
          </Label>
        )
      }}
    />
  )
};

const mapDispatchToProps = {
  clearPlaylist,
}

export default connect(null, mapDispatchToProps)(ClearPlaylist);
