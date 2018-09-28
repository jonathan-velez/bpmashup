import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as thunks from '../thunks';

const LoveItem = ({ type, item, toggleLoveItem, lovedTracks, lovedArtists, lovedLabels }) => {
  let isLoved = false;

  switch (type) {
    case 'artist':
      isLoved = lovedArtists.includes(item.id);
      break;
    case 'label':
      isLoved = lovedLabels.includes(item.id);
      break;
    case 'track':
      isLoved = lovedTracks.includes(item.id);
      break;
    default:
      break;
  }

  return (
    <Button
      basic
      onClick={() => toggleLoveItem(type, item.id)}
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
    lovedArtists: state.lovedArtists,
    lovedLabels: state.lovedLabels,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(thunks, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoveItem);
