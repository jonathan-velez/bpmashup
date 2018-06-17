import React from 'react';
import { connect } from 'react-redux';

import { Button, Icon, Dropdown } from 'semantic-ui-react';
import { downloadTrack } from '../utils/trackUtils';

const DownloadTrack = ({ track, downloadedTracks, type }) => {
  const hasBeenDownloaded = downloadedTracks.includes(track.id.toString());
  
  const downloadButton = 
    <Button
      basic
      onClick={() => downloadTrack(track)}
    >
      <Button.Content visible>
        <Icon name='download' color={hasBeenDownloaded ? 'red' : ''} />
      </Button.Content>
    </Button>
  
  const downloadDropdownItem = <Dropdown.Item icon='download' text='Download' onClick={() => downloadTrack(track)} />

  return (
    type === 'dropdownItem' ? downloadDropdownItem : downloadButton
  );
};

const mapStateToProps = state => {
  return {
    downloadedTracks: state.downloadedTracks,
  }
}

export default connect(mapStateToProps, {})(DownloadTrack);
