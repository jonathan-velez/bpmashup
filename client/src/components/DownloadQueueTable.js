import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Popup, Dropdown } from 'semantic-ui-react';
import moment from 'moment';

import NothingHereMessage from './NothingHereMessage';
import {
  constructLinks,
  constructTrackLink,
  generateBPTrackLink,
} from '../utils/trackUtils';
import { musicalKeyFilter, convertEpochToDate } from '../utils/helpers';

const DownloadQueueTable = ({ queue, downloadTrack, retryDownload }) => {
  const queueItems = Object.keys(queue);
  if (queueItems.length === 0) {
    return <NothingHereMessage />;
  }

  const tableBody = queue.map((item, idx) => {
    const { addedDate, url, fileName, key, track, status } = item;
    const { artists, label, genres, bpm, key: musicalKey } = track;

    let downloadButtonText = 'Download';
    let downloadButtonColor = 'positive';
    let downloadButtonIsDisabled = false;
    let downloadButtonPopupContent = '';
    const addedDateObject = convertEpochToDate(addedDate.seconds);

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
        downloadButtonText = 'Failed';
        downloadButtonColor = 'negative';
        downloadButtonPopupContent = 'The download request failed.';
        break;
      case 'downloaded':
        downloadButtonText = 'Downloaded';
        downloadButtonColor = 'primary';
        downloadButtonPopupContent = `This track has already been downloaded, but you can download it again.`;
        break;
      case 'available':
        downloadButtonPopupContent = `Your track is available to download!`;
        break;
      default:
        break;
    }

    const openPurchaseLink = (href) => {
      const purchaseWindow = window.open('/downloadLink.html', '_blank');
      purchaseWindow.location = href;
    };

    // In order for the Popup to work on disabled buttons, we need to wrap it in a div
    const downloadButton =
      status === 'notAvailable' ? (
        <Dropdown button floating text='Failed' className='negative'>
          <Dropdown.Menu>
            <Dropdown.Item
              text='Retry'
              icon='redo'
              onClick={() => retryDownload(key)}
            />
            <Dropdown.Item
              text='Purchase'
              icon='cart arrow down'
              onClick={() => openPurchaseLink(generateBPTrackLink(track))}
            />
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <div>
          <Button
            fluid
            primary={downloadButtonColor === 'primary'}
            negative={downloadButtonColor === 'negative'}
            positive={downloadButtonColor === 'positive'}
            disabled={downloadButtonIsDisabled}
            onClick={() => downloadTrack(url, fileName, key, status)}
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
        <Table.Cell collapsing>
          <Popup
            content={downloadButtonPopupContent}
            trigger={downloadButton}
          />
        </Table.Cell>
      </Table.Row>
    );
  });

  return (
    <Table striped unstackable padded>
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
