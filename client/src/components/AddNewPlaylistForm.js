import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Form, Input } from 'semantic-ui-react';

const AddNewPlaylistForm = ({ handleSubmit, newPlaylistName, handleInputChange }) => {
  useEffect(() => {
    focusInput();
  }, []);

  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
    ReactDOM.findDOMNode(inputRef.current).querySelector('input').select();
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        placeholder='Playlist name'
        size='large'
        fluid
        value={newPlaylistName}
        onChange={(e) => handleInputChange(e)}
        ref={inputRef}
        action='Create Playlist'
      />
    </Form>
  );
}

export default AddNewPlaylistForm;
