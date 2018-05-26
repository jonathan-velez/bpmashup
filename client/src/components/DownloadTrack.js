import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

import { downloadTrack } from '../utils/trackUtils';

const DownloadTrack = ({ track, mini }) => {
  return (
    <Button
      basic
      animated
      color='grey'
      onClick={() => downloadTrack(track)}
    >
      <Button.Content visible>
        <Icon name='download' />
      </Button.Content>
      <Button.Content hidden>{mini ? 'DL' : 'Download'}</Button.Content>
    </Button>
  );
};

export default DownloadTrack;