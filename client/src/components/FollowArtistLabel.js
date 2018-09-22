import React from 'react';
import { Label, Icon } from 'semantic-ui-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as thunks from '../thunks';

const FollowArtistLabel = ({ type, id, followedArtists, followedLabels, toggleFollow }) => {
  const isFollowed = type === 'artist' ? followedArtists.includes(id) : followedLabels.includes(id);

  return (
    <Label as='a' onClick={toggleFollow(id)}>
      <Icon name='plus' size='large' color={isFollowed ? 'red' : 'grey'} />Follow
    </Label>
  );
};

const mapStateToProps = state => {
  return {
    followedArtists: state.followedArtists,
    followedLabels: state.followedLabels,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(thunks, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowArtistLabel);
