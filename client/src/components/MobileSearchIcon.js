import React from 'react';
import { Icon } from 'semantic-ui-react';

const MobileSearchIcon = ({ handleShowSearchBar }) => {
  return (
    <Icon
      name='search'
      onClick={handleShowSearchBar}
      style={{ cursor: 'pointer' }}
    />
  );
};

export default MobileSearchIcon;
