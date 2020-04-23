import React from 'react';
import { Button, Menu, Icon } from 'semantic-ui-react';

const BuyTrack = ({ type, purchaseLink }) => {
  return (
    type === 'dropdownItem' ?
      <Menu.Item as='a' href={purchaseLink} target='_blank'><Icon name='cart arrow down' />Purchase</Menu.Item> :
      <Button as='a' href={purchaseLink} target='_blank' basic icon='cart arrow down'  />
  );
};

export default BuyTrack;
