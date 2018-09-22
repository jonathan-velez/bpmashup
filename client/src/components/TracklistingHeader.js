import React from 'react';
import { Header, Label, Icon } from 'semantic-ui-react';

import { deslugify } from '../utils/helpers';
import LoveTrack from './LoveTrack';

const TracklistingHeader = ({ headerPrefix, headerTitle, headerType }) => {
  const item = {
    id: headerTitle
  }

  return (
    <Header size='huge' className='tracklistHeader' textAlign='left'>
      <span className='tracklistHeaderPrefix'>{headerPrefix} </span>
      {deslugify(headerTitle.toUpperCase())} {headerType === 'artist' || headerType === 'label' ? <LoveTrack item={item} type={headerType} /> : null}
    </Header>
  );
};

export default TracklistingHeader;
