import React from 'react';
import { connect } from 'react-redux';

import { Button, Icon, Dropdown } from 'semantic-ui-react';
// import { downloadTrack } from '../utils/trackUtils';
import { addTrackToDownloadQueue } from '../thunks';
import { hasBeenDownloaded } from '../selectors';

const DownloadTrack = ({
  track,
  type,
  hasBeenDownloaded,
  addTrackToDownloadQueue,
}) => {
  const downloadIcon = (
    <Icon
      name='download'
      color={hasBeenDownloaded ? 'red' : 'grey'}
      title={hasBeenDownloaded ? 'Download it again' : 'Download it'}
    />
  );
  const downloadButton = (
    <Button basic onClick={() => addTrackToDownloadQueue(track)}>
      <Button.Content visible>{downloadIcon}</Button.Content>
    </Button>
  );
  const downloadDropdownItem = (
    <Dropdown.Item onClick={() => addTrackToDownloadQueue(track)}>
      {downloadIcon}Download
    </Dropdown.Item>
  );

  return type === 'dropdownItem' ? downloadDropdownItem : downloadButton;
};

const mapStateToProps = (state, ownProps) => {
  return {
    hasBeenDownloaded: hasBeenDownloaded(state, ownProps.track.id),
  }
}

const mapDispatchToProps = {
  addTrackToDownloadQueue,
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadTrack);
