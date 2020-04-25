import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Tab } from 'semantic-ui-react';

import DownloadQueueTable from './DownloadQueueTable';
import { updateTrackStatus } from '../thunks';
import {
  getCurrentDownloadQueueItems,
  getArchivedDownloadQueueItems,
  getUserDownloadQueueTrackIds,
} from '../selectors';
import { fileExistsOnDownloadServer } from '../utils/trackUtils';
import { generateActivityMessage } from '../utils/storeUtils';

const DownloadQueuePage = ({
  updateTrackStatus,
  currentDownloadQueueItems,
  archivedDownloadQueueItems,
}) => {
  const handleDownloadClick = async (url, fileName, queueId) => {
    // check if file still exists on server. Due to Heroku Dyno's ephemeral file system, file existence is not guaranteed
    // if it doesn't, re-initiate for processing in download queue

    const fileExists = await fileExistsOnDownloadServer(fileName);
    if (fileExists) {
      const downloadWindow = window.open('/downloadLink.html', '_blank');
      downloadWindow.location = url;
      updateTrackStatus(queueId, 'downloaded');
    } else {
      updateTrackStatus(queueId, 'initiated'); // TODO: set update date, since this is a re-do
      generateActivityMessage(
        'File not found on server, re-initiating download',
      );
    }
  };

  const retryDownload = (queueId) => {
    updateTrackStatus(queueId, 'initiated'); // TODO: set update date and retry tally. consider throttling/limiting requests
    generateActivityMessage('Track re-initiated for processing.');
  };

  const markTrackAsPurchased = (queueId) => {
    updateTrackStatus(queueId, 'purchased');
    generateActivityMessage('Track marked as purchased.');
  }

  const panes = [
    {
      menuItem: 'DOWNLOAD QUEUE',
      render: () => (
        <DownloadQueueTable
          queue={currentDownloadQueueItems}
          downloadTrack={handleDownloadClick}
          retryDownload={retryDownload}
          markTrackAsPurchased={markTrackAsPurchased}
        />
      ),
    },
    {
      menuItem: 'ARCHIVE',
      render: () => (
        <DownloadQueueTable
          queue={archivedDownloadQueueItems}
          downloadTrack={handleDownloadClick}
          retryDownload={retryDownload}
          markTrackAsPurchased={markTrackAsPurchased}
        />
      ),
    },
  ];
  return (
    <Fragment>
      <Tab menu={{ secondary: true, pointing: true }} panes={panes}></Tab>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    downloadQueue: state.downloadQueue,
    currentDownloadQueueItems: getCurrentDownloadQueueItems(state).sort(
      (a, b) => b.addedDate.seconds - a.addedDate.seconds,
    ),
    archivedDownloadQueueItems: getArchivedDownloadQueueItems(state).sort(
      (a, b) => b.addedDate.seconds - a.addedDate.seconds,
    ),
    downloadedTrackIds: getUserDownloadQueueTrackIds(state),
  };
};

const mapDispatchToProps = {
  updateTrackStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadQueuePage);
