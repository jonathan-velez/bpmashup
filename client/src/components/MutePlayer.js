import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon } from 'semantic-ui-react';

import * as actionCreators from '../actions/ActionCreators';

class MutePlayer extends Component {
  render() {
    const { muted } = this.props.mediaPlayer;
    return (
      <Icon
        link
        fitted
        name={muted ? 'mute' : 'unmute'}
        onClick={this.props.toggleMute}
        size='large'
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    mediaPlayer: state.mediaPlayer
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MutePlayer);
