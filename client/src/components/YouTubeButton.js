import React from 'react';
import { Icon, Popup } from 'semantic-ui-react';

import YouTubeButtonPopup from './YouTubeButtonPopup';

const YouTubeButton = ({ getYouTube, isLoaded, loadedTrack }) => {
  const youtubeIcon =
    <Icon
      name='youtube play'
      onClick={() => {
        if (!isLoaded) {
          getYouTube(loadedTrack)
        }
      }}
      link={!isLoaded}
      disabled={isLoaded}
      fitted
      color='red'
      size='large'
      title={isLoaded ? 'YouTube track loaded' : 'Load full track from YouTube'}
    />

  const popUp = <Popup
    basic
    on='click'
    flowing
    trigger={youtubeIcon}
    content={<YouTubeButtonPopup />}
  />

  return (
    isLoaded ? popUp : youtubeIcon
  );
};

export default YouTubeButton;
