import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Autosuggest from 'react-autosuggest';

import * as actionCreators from '../actions/ActionCreators';
import { Form } from 'semantic-ui-react';
import { slugify } from '../utils/helpers';

class SearchTracks extends Component {
  handleFormSubmit = () => {    
    const sluggedString = slugify(this.props.autoSuggest.value);
    this.props.history.push(`/search/${sluggedString}`);
  }

  getSuggestionValue = (suggestion) => {
    return suggestion.name;
  }

  renderSuggestion = (suggestion) => {
    return (
      <span>{suggestion.name}</span>
    );
  }

  render() {
    const { updateSuggestionInputValue, clearSuggestions, loadSuggestions } = this.props;
    const { value = '', suggestions } = this.props.autoSuggest;    

    const inputProps = {
      placeholder: "Search...",
      value,
      onChange: updateSuggestionInputValue
    };

    return (
      <Form onSubmit={this.handleFormSubmit}>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={loadSuggestions}
          onSuggestionsClearRequested={clearSuggestions}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
          highlightFirstSuggestion          
        />
      </Form>
    );
  }
}

const mapStateToProps = state => {
  return {
    trackListing: state.trackListing,
    isLoading: state.isLoading,
    autoSuggest: state.autoSuggest,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchTracks));
