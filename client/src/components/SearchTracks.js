import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Autosuggest from 'react-autosuggest';

import * as actionCreators from '../actions/ActionCreators';
import { Form } from 'semantic-ui-react';
import { slugify } from '../utils/helpers';

const SearchTracks = ({ updateSuggestionInputValue, clearSuggestions, loadSuggestions, autoSuggest }) => {
  const handleFormSubmit = () => {
    const sluggedString = slugify(this.props.autoSuggest.value);
    this.props.history.push(`/search/${sluggedString}`);
  }

  const getSuggestionValue = (suggestion) => {
    return suggestion.name;
  }

  const renderSuggestion = (suggestion) => {
    return (
      <span>{suggestion.name}</span>
    );
  }

  const { value = '', suggestions } = autoSuggest;

  const inputProps = {
    placeholder: "Search...",
    value,
    onChange: updateSuggestionInputValue
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={loadSuggestions}
        onSuggestionsClearRequested={clearSuggestions}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        highlightFirstSuggestion
      />
    </Form>
  );
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
