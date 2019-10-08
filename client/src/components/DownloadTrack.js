import React from 'react';
import { connect } from 'react-redux';

import { Button, Icon, Dropdown } from 'semantic-ui-react';
import { downloadTrack } from '../utils/trackUtils';
import { hasBeenDownloaded } from '../selectors';

const DownloadTrack = ({ track, type, hasBeenDownloaded }) => {
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

const mapStateToProps = (state, ownProps) => {
  return {
    hasBeenDownloaded: hasBeenDownloaded(state, ownProps.track.id),
  }
}

export default connect(mapStateToProps)(DownloadTrack);
