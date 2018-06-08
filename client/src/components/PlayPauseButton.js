import React from 'react';
import { Icon } from 'semantic-ui-react';

const PlayPause = props => {
  const { isPlaying, playPause } = props;
  return (
    <Icon link fitted name={isPlaying ? 'pause' : 'play'} onClick={playPause} size='large' />
  )
}

export default PlayPause;