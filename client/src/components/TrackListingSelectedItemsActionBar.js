import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';

import { addTrackToDownloadQueue } from '../thunks';
import {
  getSelectedTracks,
  getSelectedTrackIds,
  getSelectedTracksCount,
  hasZippyPermission,
} from '../selectors';
import { removeAllTracksFromSelectedList } from '../actions/ActionCreators';
import { generateActivityMessage } from '../utils/storeUtils';
import ConfirmAction from './ConfirmAction';

const TrackListingSelectedItemsActionBar = ({
  selectedTracks,
  selectedTrackIds,
  numberOfSelectedTracks,
  addTrackToDownloadQueue,
  removeAllTracksFromSelectedList,
  canZip,
}) => {
  const handleDownloadTracks = () => {
    selectedTrackIds.forEach((trackId) =>
      addTrackToDownloadQueue(selectedTracks[trackId], false),
    );

    removeAllTracksFromSelectedList();
    generateActivityMessage(
      `${numberOfSelectedTracks} tracks have been added to your download queue.`,
    );
  };

  // Just a download button for now, but will add other capabilities later.
  // If user no can zip, then they have useless checkboxes for now lol /shrug
  if (!selectedTrackIds || selectedTrackIds <= 0 || !canZip) return null;

  const downloadTracksText = `Download ${numberOfSelectedTracks} track${
    numberOfSelectedTracks > 1 ? 's' : ''
  }`;

  return (
    <ConfirmAction
      action={handleDownloadTracks}
      confirmText={`${downloadTracksText}?`}
      render={(openConfirm) => {
        return (
          <Button
            onClick={openConfirm}
            icon='download'
            labelPosition='right'
            content={downloadTracksText}
          />
        );
      }}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    selectedTracks: getSelectedTracks(state),
    selectedTrackIds: getSelectedTrackIds(state),
    numberOfSelectedTracks: getSelectedTracksCount(state),
    canZip: hasZippyPermission(state),
  };
};

export default connect(
  mapStateToProps,
  { addTrackToDownloadQueue, removeAllTracksFromSelectedList },
)(TrackListingSelectedItemsActionBar);
