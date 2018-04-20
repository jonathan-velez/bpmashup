import React, { Component } from 'react';
import { Form, Button, Input } from 'semantic-ui-react';

class AddNewPlaylistForm extends Component {
  componentDidMount() {
    this.focus();
  }
  
  handleRef = (input) => {
    this.inputRef = input;
  }

  focus = () => {
    this.inputRef.focus();
  }

  render() {
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <Input
          placeholder='Playlist name'
          size='large'
          fluid
          value={this.props.newPlaylistName}
          onChange={(e) => this.props.handleInputChange(e)}
          ref={this.handleRef}
          action='Create Playlist'
        />
      </Form>
    );
  }
}

export default AddNewPlaylistForm;