import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Icon, Label } from 'semantic-ui-react';

import ConfirmAction from './ConfirmAction';
import { deletePlaylist } from '../thunks';

const DeletePlaylist = ({ playlistId, deletePlaylist, history }) => {
  const handleDeletePlaylist = () => {
    if (playlistId) {
      deletePlaylist(playlistId);
      history.push(`/`);
    } else {
      throw new Error('Error deleting playlist. Missing playlist ID.');
    }
  }
  return (
    <ConfirmAction
      action={handleDeletePlaylist}
      confirmText='Delete playlist? This cannot be reversed.'
      render={confirm => {
        return (
          <Label as='a' onClick={confirm}>
            <Icon link name='trash' size='large' color='black' />
            Delete playlist
          </Label>
        )
      }}
    />
  )
};

const mapDispatchToProps = {
  deletePlaylist,
}

export default connect(null, mapDispatchToProps)(withRouter(DeletePlaylist));
