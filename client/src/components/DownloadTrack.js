import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actionCreators from '../actions/ActionCreators';
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
        <Icon name='download' color={hasBeenDownloaded ? 'red' : 'grey'} />
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

const mapDispatchToProps = dispatch => {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadTrack);
