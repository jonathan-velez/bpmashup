import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { fetchGenres } from '../actions/ActionCreators';
import GenreList from '../components/GenreList';

class GenreControl extends React.Component {
  componentDidMount() {
    this.props.fetchGenres();
  }

  render() {
    return (
      <GenreList genres={this.props.genreListing} />
    )
  }
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
