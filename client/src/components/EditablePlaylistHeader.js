import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Form, Input, } from 'semantic-ui-react';

import PlaylistHeader from './PlaylistHeader';
import { editPlaylistName } from '../thunks';

// TODO: Truly make this re-usable. Similar to what we did with ConfirmAction component
const EditablePlaylistHeader = ({ editPlaylistName, playlistId, playlistName }) => {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [playlistNameEditMode, setPlaylistNameEditMode] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (playlistNameEditMode) {
      inputRef.current.focus();
    }
  }, [playlistNameEditMode]);

  const validatePlaylistName = (newPlaylistName) => {
    return newPlaylistName.length < 51;
  }

  // TODO: create custom useInput hook
  const handlePlaylistNameChange = (evt) => {
    const { value } = evt.target;

    if (validatePlaylistName(value)) {
      setNewPlaylistName(value);
    }
  }

  const handleTogglePlaylistNameEditMode = () => {
    setNewPlaylistName(playlistName);
    setPlaylistNameEditMode(!playlistNameEditMode);
  }

  const handleFormSubmit = () => {
    editPlaylistName({
      playlistId,
      newName: newPlaylistName,
    });

    handleTogglePlaylistNameEditMode();
  }

  return (
    <React.Fragment>
      {playlistNameEditMode ?
        <Form onSubmit={handleFormSubmit} className='playlistEditInput'>
          <Input
            value={newPlaylistName}
            onChange={handlePlaylistNameChange}
            size='massive' //TODO: Style this to be the same as the header
            onBlur={handleFormSubmit}
            ref={inputRef}
            fluid
            transparent
          />
        </Form>
        :
        <PlaylistHeader
          playlistName={playlistName}
          editHeader={handleTogglePlaylistNameEditMode}
        />
      }
    </React.Fragment>
  );
};

const mapDispatchToProps = {
  editPlaylistName,
}

export default connect(null, mapDispatchToProps)(EditablePlaylistHeader);
