import React from 'react';
import { Icon, Popup } from 'semantic-ui-react';

import YouTubeButtonPopup from './YouTubeButtonPopup';

class YouTubeButton extends React.PureComponent {
  render() {
    const { getYouTube, isLoaded, loadedTrack } = this.props;
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
      on='hover'
      hoverable
      flowing
      trigger={youtubeIcon}
      content={<YouTubeButtonPopup />}
    />

    return (
      isLoaded ? popUp : youtubeIcon
    );
  }
}

export default YouTubeButton;
