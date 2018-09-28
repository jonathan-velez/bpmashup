import React from 'react';
import { Header } from 'semantic-ui-react';

import { deslugify } from '../utils/helpers';
import LoveItem from './LoveItem';

const TracklistingHeader = ({ headerPrefix, headerTitle, headerId, headerType }) => {
  const item = {
    id: headerId,
    name: headerTitle,
  }

  return (
    <Header size='huge' className='tracklistHeader' textAlign='left'>
      <span className='tracklistHeaderPrefix'>{headerPrefix} </span>
      {deslugify(headerTitle.toUpperCase())} {headerType === 'artist' || headerType === 'label' ? <LoveItem item={item} type={headerType} /> : null}
    </Header>
  );
};

export default TracklistingHeader;