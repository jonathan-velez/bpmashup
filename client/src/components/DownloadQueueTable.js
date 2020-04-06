import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Popup } from 'semantic-ui-react';
import moment from 'moment';

import NothingHereMessage from './NothingHereMessage';
import { constructLinks, constructTrackLink } from '../utils/trackUtils';
import { musicalKeyFilter } from '../utils/helpers';

const DownloadQueueTable = ({ queue, downloadTrack }) => {
  const queueItems = Object.keys(queue);
  if (queueItems.length === 0) {
    return <NothingHereMessage />;
  }

  const tableBody = queue.map((item, idx) => {
    const { addedDate, url, fileName, key, dateAvailable, track } = item;
    const { artists, label, genres, bpm, key: musicalKey } = track;

    let downloadButtonText = 'Download';
    let downloadButtonColor = 'positive';
    let downloadButtonIsDisabled = false;
    let downloadButtonPopupContent = '';
    const downloadExpirationDate = moment(dateAvailable).add(1, 'day');
    const downloadExpirationDateFormatted = downloadExpirationDate.format(
      'MM/DD/YYYY hh:MM:ss A',
    );
    const addedDateObject = new Date(0);
    addedDateObject.setUTCSeconds(addedDate.seconds || 0);

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
          onClick={() => downloadTrack(url, fileName, key)}
        >
          {downloadButtonText}
        </Button>
      </div>
    );

    return (
      <Table.Row key={idx}>
        <Table.Cell>{constructTrackLink(track)}</Table.Cell>
        <Table.Cell>{constructLinks(artists, 'artist')}</Table.Cell>
        <Table.Cell>
          <Link to={`/label/${label.slug}/${label.id}`}>{label.name}</Link>
        </Table.Cell>
        <Table.Cell>{constructLinks(genres, 'genre')}</Table.Cell>
        <Table.Cell>{bpm}</Table.Cell>
        <Table.Cell>
          {musicalKeyFilter(musicalKey && musicalKey.shortName)}
        </Table.Cell>
        <Table.Cell>
          {moment(addedDateObject).format('MM/DD/YYYY hh:MM:ss A')}
        </Table.Cell>
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
          <Table.HeaderCell>TITLE</Table.HeaderCell>
          <Table.HeaderCell>ARTISTS</Table.HeaderCell>
          <Table.HeaderCell>LABEL</Table.HeaderCell>
          <Table.HeaderCell>GENRE</Table.HeaderCell>
          <Table.HeaderCell>BPM</Table.HeaderCell>
          <Table.HeaderCell>KEY</Table.HeaderCell>
          <Table.HeaderCell>DATE ADDED</Table.HeaderCell>
          <Table.HeaderCell>STATUS</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>{tableBody}</Table.Body>
    </Table>
  );
};

export default DownloadQueueTable;
