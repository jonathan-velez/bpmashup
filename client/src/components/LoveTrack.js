import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as thunks from '../thunks';

const LoveTrack = ({ track, toggleLoveTrack, lovedTracks }) => {
  this.handleLoveTrack = (trackObj) => {
    toggleLoveTrack(trackObj.id);
  }

  const isLoved = lovedTracks.includes(track.id);

  return (
    <Button
      basic
      onClick={() => this.handleLoveTrack(track)}
    >
      <Button.Content visible>
        <Icon color={isLoved ? 'red' : 'grey'} name='heart' />
      </Button.Content>
    </Button>
  );
};

const mapStateToProps = state => {
  return {
    lovedTracks: state.lovedTracks,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(thunks, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoveTrack);
