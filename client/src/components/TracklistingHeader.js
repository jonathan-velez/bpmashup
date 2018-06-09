import React from 'react';
import { Header } from 'semantic-ui-react';

import { deslugify } from '../utils/helpers';

const TracklistingHeader = ({ headerPrefix, headerTitle }) => {

  return (
    <React.Fragment>
      <Header size='huge' className='tracklistHeader' textAlign='left'>
        <span className='tracklistHeaderPrefix'>{headerPrefix} </span>
        {deslugify(headerTitle.toUpperCase())}
      </Header>
    </React.Fragment>
  );
};

export default TracklistingHeader;
