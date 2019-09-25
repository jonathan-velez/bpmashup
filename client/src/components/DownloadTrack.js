import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Button, Icon, Dropdown } from 'semantic-ui-react';
import { downloadTrack } from '../utils/trackUtils';

const DownloadTrack = ({ track, downloadedTracks, type }) => {
  const hasBeenDownloaded = downloadedTracks.includes(track.id);
  const downloadIcon = <Icon name='download' color={hasBeenDownloaded ? 'red' : 'grey'} title={hasBeenDownloaded ? 'Download it again' : 'Download it'} />
  const downloadButton =
    <Button
      basic
      onClick={() => downloadTrack(track)}
    >
      <Button.Content visible>
        {downloadIcon}
      </Button.Content>
    </Button>
  const downloadDropdownItem = <Dropdown.Item onClick={() => downloadTrack(track)}>{downloadIcon}Download</Dropdown.Item>

  return (
    type === 'dropdownItem' ? downloadDropdownItem : downloadButton
  );
};

const mapStateToProps = state => {
  return {
    downloadedTracks: state.downloadedTracks,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadTrack);
