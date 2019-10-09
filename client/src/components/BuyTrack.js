import React from 'react';
import { Button, Dropdown, Icon } from 'semantic-ui-react';

const BuyTrack = ({ type, purchaseLink }) => {
  return (
    type === 'dropdownItem' ?
      <Dropdown.Item as='a' href={purchaseLink} target='_blank'><Icon name='cart arrow down' />Purchase</Dropdown.Item> :
      <Button as='a' href={purchaseLink} target='_blank' basic icon='cart arrow down'  />
  );
};

export default BuyTrack;
