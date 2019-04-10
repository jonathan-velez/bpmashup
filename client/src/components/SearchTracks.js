import React from 'react';
import { withRouter } from 'react-router';

import { Form, Input } from 'semantic-ui-react';
import { slugify } from '../utils/helpers';

class SearchTracks extends React.Component {

  state = {
    searchString: '',
  }

  handleFormSubmit = () => {
    const { history } = this.props;
    const { searchString } = this.state;

    const sluggedString = slugify(searchString);
    history.push(`/search/${sluggedString}`);
  }

  handleChange = ({ target }) => {
    const { value } = target;
    this.setState({
      searchString: value,
    })
  }

  render() {
    const inputStyle = {
      width: '300px'
    }
    return (
      <Form onSubmit={this.handleFormSubmit}>
        <Input size='medium' onChange={(e) => this.handleChange(e)} placeholder="Search..." style={inputStyle}/>
      </Form>
    );
  }
}


export default (withRouter(SearchTracks));
