import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { fetchGenres } from '../actions/ActionCreators';
import GenreList from '../components/GenreList';

const GenreControl = ({ genreListing, fetchGenres }) => {
  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  return (
    <GenreList genres={genreListing} />
  )
}

const mapStateToProps = state => {
  return {
    genreListing: state.genreListing
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ fetchGenres }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GenreControl);
