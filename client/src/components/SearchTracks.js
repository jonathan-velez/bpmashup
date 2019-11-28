import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router';

import { Form, Input, Icon } from 'semantic-ui-react';

const SearchTracks = ({ history }) => {
  const [searchString, setSearchString] = useState('');
  const inputRef = useRef(null);

  const handleFormSubmit = () => {
    const sluggedString = encodeURIComponent(searchString);
    history.push(`/search/${sluggedString}`);
  }

  const handleChange = ({ target }) => {
    setSearchString(target.value);
  }

  const selectInputText = () => {
    ReactDOM.findDOMNode(inputRef.current).querySelector('input').select();
  }

  const inputStyle = {
    width: '300px'
  }

  return (
    <Form onSubmit={handleFormSubmit}>
      <Input
        ref={inputRef}
        size='medium'
        onChange={(e) => handleChange(e)}
        onFocus={selectInputText}
        style={inputStyle}
        iconPosition='left'
      >
        <Icon name='search' />
        <input />
      </Input>
    </Form>
  );

}

export default (withRouter(SearchTracks));
