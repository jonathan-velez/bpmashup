import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Popup, Dropdown, Icon } from 'semantic-ui-react';
import moment from 'moment';

import NothingHereMessage from './NothingHereMessage';
import TrackAlbum from './TrackAlbum';
import {
  constructLinks,
  constructTrackLink,
  generateBPTrackLink,
} from '../utils/trackUtils';
import { musicalKeyFilter } from '../utils/helpers';

const DownloadQueueTable = ({
  queue,
  downloadTrack,
  retryDownload,
  markTrackAsPurchased,
}) => {
  if (queue.length === 0) {
    return <NothingHereMessage />;
  }

  const tableBody = queue.map((item, idx) => {
    const {
      addedDate,
      url,
      fileName,
      queueId,
      track,
      status,
      isYouTube = false,
    } = item;

    let artists,
      genre = {},
      bpm,
      musicalKey,
      image,
      label = {};
    // hacky way to deal w/ older download items pre bp v4 API release where the track changed
    if (
      moment.unix(addedDate.seconds).isAfter(moment('20210321', 'YYYYMMDD'))
    ) {
      artists = track.artists;
      genre = track.genre;
      bpm = track.bpm;
      musicalKey = track.key;
      image = track.release && track.release.image && track.release.image.uri;
      label = track.release && track.release.label;
    } else {
      artists = track.artists;
      genre = track.genres;
      bpm = track.bpm;
      musicalKey = track.key;
      image =
        track.images && track.images.medium && track.images.medium.secureUrl;
      label = track.label;
    }

    const { id: labelId, name: labelName, slug: labelSlug } = label || {};

    let downloadButtonText = 'Download';
    let downloadButtonColor = 'positive';
    let downloadButtonIsDisabled = false;
    let downloadButtonPopupContent = '';

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
        downloadButtonPopupContent = `This track has already been downloaded.\nDownload it again or better yet - purchase it!`;
        break;
      case 'available':
        downloadButtonPopupContent = `Your track is available to download! ${isYouTube &&
          '(YouTube rip 😩)'}`;
        break;
      case 'purchased':
        downloadButtonText = 'Purchased';
        downloadButtonPopupContent = `You purchased this track. Thanks for supporting the artist!`;
        downloadButtonIsDisabled = true;
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
      status === 'notAvailable' || status === 'downloaded' ? (
        <Dropdown
          button
          floating
          text={downloadButtonText}
          className={downloadButtonColor}
        >
          <Dropdown.Menu>
            <Dropdown.Item
              text={status === 'notAvailable' ? 'Retry' : 'Re-download'}
              icon='redo'
              onClick={() => retryDownload(queueId)}
            />
            <Dropdown.Item
              text='Purchase'
              icon='cart arrow down'
              onClick={() => openPurchaseLink(generateBPTrackLink(track))}
            />
            <Dropdown.Item
              text='Mark as Purchased'
              icon='checkmark'
              onClick={() => markTrackAsPurchased(queueId)}
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
            onClick={() => downloadTrack(url, fileName, queueId, status)}
          >
            {downloadButtonText}
            {isYouTube && (
              <Icon name='youtube' style={{ paddingLeft: '10px' }} />
            )}
          </Button>
        </div>
      );

    return (
      track && (
        <Table.Row key={idx}>
          <Table.Cell>
            {image ? (
              <TrackAlbum
                imageUrl={image}
                imageSize='tiny'
                iconSize='big'
                track={track}
              />
            ) : (
              ''
            )}
          </Table.Cell>
          <Table.Cell>{constructTrackLink(track)}</Table.Cell>
          <Table.Cell>{constructLinks(artists, 'artist')}</Table.Cell>
          <Table.Cell>
            <Link to={`/label/${labelSlug}/${labelId}`}>{labelName}</Link>
          </Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell>{bpm}</Table.Cell>
          <Table.Cell>
            {musicalKeyFilter(musicalKey && musicalKey.shortName)}
          </Table.Cell>
          <Table.Cell>
            {moment.unix(addedDate.seconds).format('MM/DD/YYYY hh:MM:ss A')}
          </Table.Cell>
          <Table.Cell collapsing>
            <Popup
              content={downloadButtonPopupContent}
              trigger={downloadButton}
            />
          </Table.Cell>
        </Table.Row>
      )
    );
  });

  return (
    <Table striped unstackable padded>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>&nbsp;</Table.HeaderCell>
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
