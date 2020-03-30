import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Tab } from 'semantic-ui-react';

import DownloadQueueTable from './DownloadQueueTable';
import { updateTrackStatus } from '../thunks';
import {
  getCurrentDownloadQueueItems,
  getArchivedDownloadQueueItems,
} from '../selectors';

const DownloadQueuePage = ({
  updateTrackStatus,
  currentDownloadQueueItems,
  archivedDownloadQueueItems,
}) => {
  const handleDownloadClick = (url, queueId) => {
    const downloadWindow = window.open('/downloadLink.html', '_blank');
    downloadWindow.location = url;
    updateTrackStatus(queueId, 'downloaded');
  };

  const panes = [
    {
      menuItem: 'DOWNLOAD QUEUE',
      render: () => (
        <DownloadQueueTable
          queue={currentDownloadQueueItems}
          downloadTrack={handleDownloadClick}
        />
      ),
    },
    {
      menuItem: 'ARCHIVE',
      render: () => (
        <DownloadQueueTable
          queue={archivedDownloadQueueItems}
          downloadTrack={handleDownloadClick}
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
    currentDownloadQueueItems: getCurrentDownloadQueueItems(state),
    archivedDownloadQueueItems: getArchivedDownloadQueueItems(state),
  };
};

const mapDispatchToProps = {
  updateTrackStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadQueuePage);
