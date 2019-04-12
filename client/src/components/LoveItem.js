import React from 'react';
import { Button, Icon, Dropdown } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as thunks from '../thunks';

const LoveItem = ({ itemType, item, toggleLoveItem, lovedTracks, lovedArtists, lovedLabels, type = 'button' }) => {
  let isLoved = false;

  switch (itemType) {
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

  const loveIcon = <Icon color={isLoved ? 'red' : 'grey'} name='heart' title={isLoved ? 'Unlove it' : 'Love it'} />

  const loveButton =
    <Button
      basic
      onClick={() => toggleLoveItem(itemType, item.id)}
    >
      <Button.Content visible>
        {loveIcon}
      </Button.Content>
    </Button>

  const loveDropDown = <Dropdown.Item onClick={() => toggleLoveItem(itemType, item.id)}>{loveIcon}{isLoved ? 'Unlove' : 'Love'}</Dropdown.Item>

  return (
    type === 'button' ? loveButton : loveDropDown
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
