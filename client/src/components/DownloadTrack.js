import React from 'react';
import { connect } from 'react-redux';

import { Button, Icon, Dropdown } from 'semantic-ui-react';
import { addTrackToDownloadQueue } from '../thunks';
import { trackHasBeenDownloaded } from '../selectors';

const DownloadTrack = ({
  track,
  type,
  addTrackToDownloadQueue,
  trackHasBeenDownloaded,
}) => {
  const downloadIcon = (
    <Icon
      name='download'
      color={trackHasBeenDownloaded ? 'red' : 'grey'}
      title={trackHasBeenDownloaded ? 'Download it again' : 'Download it'}
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
    trackHasBeenDownloaded: trackHasBeenDownloaded(state, ownProps.track.id),
  };
};

const mapDispatchToProps = {
  addTrackToDownloadQueue,
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadTrack);
