import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router';

import { Form, Input, Icon } from 'semantic-ui-react';

class SearchTracks extends React.Component {
  state = {
    searchString: '',
  }

  handleFormSubmit = () => {
    const { history } = this.props;
    const { searchString } = this.state;

    const sluggedString = encodeURIComponent(searchString);
    history.push(`/search/${sluggedString}`);
  }

  handleChange = ({ target }) => {
    const { value } = target;
    this.setState({
      searchString: value,
    })
  }

  selectInputText = () => {
    ReactDOM.findDOMNode(this.inputRef).querySelector('input').select();
  }

  setInputRef = (input) => {
    this.inputRef = input;
  }

  render() {
    const inputStyle = {
      width: '300px'
    }
    return (
      <Form onSubmit={this.handleFormSubmit}>
        <Input
          ref={this.setInputRef}
          size='medium'
          onChange={(e) => this.handleChange(e)}
          onFocus={this.selectInputText} 
          style={inputStyle}
          iconPosition='left'
        >
          <Icon name='search' />
          <input />
        </Input>
      </Form>
    );
  }
}


export default (withRouter(SearchTracks));
