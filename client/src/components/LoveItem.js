import React from 'react';
import { Button, Icon, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { toggleItemNew } from '../thunks';

const LoveItem = ({
  itemType,
  item,
  toggleItemNew,
  lovedTracks,
  lovedArtists,
  lovedLabels,
  type = 'button',
}) => {
  let isLoved = false;

  switch (itemType) {
    case 'artist':
      isLoved = lovedArtists[item.id] && lovedArtists[item.id].loved;
      break;
    case 'label':
      isLoved = lovedLabels[item.id] && lovedLabels[item.id].loved;
      break;
    case 'track':
      isLoved = lovedTracks[item.id] && lovedTracks[item.id].loved;
      break;
    default:
      break;
  }

  const loveIcon = (
    <Icon
      color={isLoved ? 'red' : 'grey'}
      name='heart'
      title={isLoved ? 'Unlove it' : 'Love it'}
    />
  );

  const loveButton = (
    <Button basic onClick={() => toggleItemNew(itemType, item, !isLoved)}>
      <Button.Content visible>{loveIcon}</Button.Content>
    </Button>
  );

  const loveDropDown = (
    <Dropdown.Item onClick={() => toggleItemNew(itemType, item, !isLoved)}>
      {loveIcon}
      {isLoved ? 'Unlove' : 'Love'}
    </Dropdown.Item>
  );

  return type === 'button' ? loveButton : loveDropDown;
};

const mapStateToProps = (state) => {
  return {
    lovedTracks: state.lovedTracks,
    lovedArtists: state.lovedArtists,
    lovedLabels: state.lovedLabels,
  };
};

const mapDispatchToProps = { toggleItemNew };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoveItem);
