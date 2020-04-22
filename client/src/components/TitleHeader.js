import React from 'react';
import { Header } from 'semantic-ui-react';

import { deslugify } from '../utils/helpers';

class TitleHeader extends React.PureComponent {
  render() {
    const { headerPrefix, headerTitle } = this.props;

    return (
      <Header size='huge' className='tracklistHeader' textAlign='left' dividing>
        {headerPrefix && (
          <span className='tracklistHeaderPrefix'>{headerPrefix}</span>
        )}
        {headerPrefix && headerTitle && ' - '}
        {deslugify(headerTitle && headerTitle.toUpperCase())}{' '}
      </Header>
    );
  }
}

export default TitleHeader;
