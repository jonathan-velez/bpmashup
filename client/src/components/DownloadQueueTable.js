import React from 'react';
import { Table, Button, Popup } from 'semantic-ui-react';
import moment from 'moment';

import NothingHereMessage from './NothingHereMessage';

const DownloadQueueTable = ({ queue, downloadTrack }) => {
  const queueItems = Object.keys(queue);
  if (queueItems.length === 0) {
    return <NothingHereMessage />;
  }

  const tableBody = queue.map((item, idx) => {
    const { addedDate, searchTerms, url, key, dateAvailable } = item;
    const { artists, mixName, name } = searchTerms;
    let downloadButtonText = 'Download';
    let downloadButtonColor = 'positive';
    let downloadButtonIsDisabled = false;
    let downloadButtonPopupContent = '';
    const downloadExpirationDate = moment(dateAvailable).add(1, 'day');
    const downloadExpirationDateFormatted = downloadExpirationDate.format(
      'MM/DD/YYYY hh:MM:ss A',
    );

    const status = moment(downloadExpirationDate).isBefore(moment())
      ? 'expired'
      : item.status;

    switch (status) {
      case 'queued':
        downloadButtonText = 'Queued';
        downloadButtonColor = '';
        downloadButtonPopupContent = 'Your request is queued to be processed.';
        downloadButtonIsDisabled = true;
        break;
      case 'initiated':
        downloadButtonText = 'Processing';
        downloadButtonColor = '';
        downloadButtonPopupContent =
          'Your request is being processed and will be available to download shortly.';
        downloadButtonIsDisabled = true;
        break;
      case 'notAvailable':
        downloadButtonText = 'Not Available';
        downloadButtonColor = 'negative';
        downloadButtonPopupContent =
          'This track is not availble to be downloaded at this time.';
        downloadButtonIsDisabled = true;
        break;
      case 'downloaded':
        downloadButtonText = 'Downloaded';
        downloadButtonColor = 'primary';
        downloadButtonPopupContent = `This track has already been downloaded and will be available to re-download until ${downloadExpirationDateFormatted}`;
        break;
      case 'available':
        downloadButtonPopupContent = `Your track is available to download and will be valid until ${downloadExpirationDateFormatted}`;
        break;
      case 'expired':
        downloadButtonText = 'Expired';
        downloadButtonColor = 'negative';
        downloadButtonPopupContent = 'This download link has expired.'; // TODO: add ability to re dl
        downloadButtonIsDisabled = true;
        break;
      default:
        break;
    }

    // In order for the Popup to work on disabled buttons, we need to wrap it in a div
    const downloadButton = (
      <div>
        <Button
          primary={downloadButtonColor === 'primary'}
          negative={downloadButtonColor === 'negative'}
          positive={downloadButtonColor === 'positive'}
          disabled={downloadButtonIsDisabled}
          onClick={() => downloadTrack(url, key)}
        >
          {downloadButtonText}
        </Button>
      </div>
    );

    return (
      <Table.Row key={idx}>
        <Table.Cell>
          {moment(addedDate).format('MM/DD/YYYY hh:MM:ss A')}
        </Table.Cell>
        <Table.Cell>
          {name} {mixName && mixName.trim.length > 0 && `( ${mixName})`}
        </Table.Cell>
        <Table.Cell>{artists}</Table.Cell>
        <Table.Cell>
          <Popup
            content={downloadButtonPopupContent}
            trigger={downloadButton}
          />
        </Table.Cell>
      </Table.Row>
    );
  });

  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Date Added</Table.HeaderCell>
          <Table.HeaderCell>Track Name</Table.HeaderCell>
          <Table.HeaderCell>Artists</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>{tableBody}</Table.Body>
    </Table>
  );
};

export default DownloadQueueTable;
