import React from 'react';
import { connect } from 'react-redux';

import { Button, Icon } from 'semantic-ui-react';
import { downloadTrack } from '../utils/trackUtils';

const DownloadTrack = ({ track, mini, blue, downloadedTracks }) => {
  const hasBeenDownloaded = downloadedTracks.includes(track.id.toString());
  return (
    <Button
      basic={!hasBeenDownloaded}
      animated
      color={hasBeenDownloaded ? 'red' : 'blue'}
      onClick={() => downloadTrack(track)}
    >
      <Button.Content visible>
        <Icon name='download' />
      </Button.Content>
      <Button.Content hidden>{mini ? 'DL' : 'Download'}</Button.Content>
    </Button>
  );
};



const mapStateToProps = state => {
  return {
    downloadedTracks: state.downloadedTracks,
  }
}

export default connect(mapStateToProps, {})(DownloadTrack);