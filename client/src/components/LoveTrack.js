import React from 'react';
import { Button, Label, Icon } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as thunks from '../thunks';

const LoveTrack = ({ type, item, toggleLoveTrack, lovedTracks, followedArtists = [], followedLabels = [] }) => {
  switch (type) {
    case 'artist':
    case 'label':
      const isFollowed = type === 'artist' ? followedArtists.includes(item.id) : followedLabels.includes(item.id);

      return (
        <Label as='a' onClick={() => toggleLoveTrack(type, item.id)}>
          <Icon name='plus' size='large' color={isFollowed ? 'red' : 'grey'} />Follow
        </Label>
      )
    case 'track':
      const isLoved = lovedTracks[type+'s'] && lovedTracks[type+'s'].includes(item.id);
      return (
        <Button
          basic
          onClick={() => toggleLoveTrack(type, item.id)}
        >
          <Button.Content visible>
            <Icon color={isLoved ? 'red' : 'grey'} name='heart' />
          </Button.Content>
        </Button>
      );
    default:
  }
};

const mapStateToProps = state => {
  return {
    lovedTracks: state.lovedTracks,
    followedArtists: state.followedArtists,
    followedLabels: state.followedLabels,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(thunks, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoveTrack);
