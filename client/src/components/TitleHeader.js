import React from 'react';
import { Header } from 'semantic-ui-react';

import { deslugify } from '../utils/helpers';
import LoveItem from './LoveItem';

class TitleHeader extends React.PureComponent {
  render() {
    const { headerPrefix, headerTitle, headerId, headerType } = this.props;
    const item = {
      id: headerId,
      name: headerTitle,
    };

    return (
      <Header size='huge' className='tracklistHeader' textAlign='left' dividing>
        {headerPrefix && (
          <span className='tracklistHeaderPrefix'>{headerPrefix}</span>
        )}{' - '}
        {deslugify(headerTitle && headerTitle.toUpperCase())}{' '}
        {(headerType === 'artist' || headerType === 'label') && (
          <LoveItem itemType={item} type={headerType} item='button' />
        )}
      </Header>
    );
  }
}

export default TitleHeader;
