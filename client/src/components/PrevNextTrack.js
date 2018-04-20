import React from 'react';
import { Icon } from 'semantic-ui-react';

const PrevNextTrack = ({ buttonType, handlePrevNextTrack }) => {
  return (
    <Icon
      circular
      link
      fitted
      name={buttonType === 'next' ? 'step forward' : 'step backward'}
      onClick={() => handlePrevNextTrack(buttonType === 'next' ? 1 : -1)}
      size='large'
    />
  )
}

export default PrevNextTrack;