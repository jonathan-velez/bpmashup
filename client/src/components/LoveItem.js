import React from 'react';
import { Button, Icon, Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { toggleLoveItem } from '../thunks';

const LoveItem = ({
  itemType,
  item,
  toggleLoveItem,
  lovedTracks,
  lovedArtists,
  lovedLabels,
  type = 'button',
  clickCallback = () => {},
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

  const handleClick = () => {
    toggleLoveItem(itemType, item, !isLoved);

    setTimeout(() => {
      clickCallback();
    }, 100);
  };

  const loveIcon = (
    <Icon
      color={isLoved ? 'red' : 'grey'}
      name='heart'
      title={isLoved ? 'Unlove it' : 'Love it'}
    />
  );

  const loveButton = (
    <Button basic onClick={handleClick}>
      <Button.Content visible>{loveIcon}</Button.Content>
    </Button>
  );

  const loveDropDown = (
    <Menu.Item onClick={handleClick}>
      {loveIcon}
      {isLoved ? 'Unlove' : 'Love'}
    </Menu.Item>
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

const mapDispatchToProps = { toggleLoveItem };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoveItem);
