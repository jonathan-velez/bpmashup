import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Header } from 'semantic-ui-react';
import moment from 'moment';
import _ from 'lodash';

import NothingHereMessage from './NothingHereMessage';

const DownloadQueue = ({ downloadQueue }) => {
  const { queue } = downloadQueue;
  const queueItems = Object.keys(queue);
  if (queueItems.length === 0) {
    return <NothingHereMessage />;
  }

  const tableBody = _.map(queue, (item, idx) => {
    let downloadButtonText = 'Download';
    let downloadButtonColor = 'primary';
    let downloadButtonIsDisabled = false;

    switch (item.status) {
      case 'queued':
      case 'initiated':
        downloadButtonText = 'Queued';
        downloadButtonColor = '';
        downloadButtonIsDisabled = true;
        break;
      case 'notAvailable':
        downloadButtonText = 'Not Available';
        downloadButtonColor = 'negative';
        downloadButtonIsDisabled = true;
        break;
      case 'downloaded':
        downloadButtonText = 'Downloaded';
        downloadButtonIsDisabled = true;
        break;
      default:
        break;
    }

    return (
      <Table.Row key={idx}>
        <Table.Cell>{moment(item.addedDate).format()}</Table.Cell>
        <Table.Cell>{item.beatportTrackId}</Table.Cell>
        <Table.Cell>Artist Name Goes Here</Table.Cell>
        <Table.Cell>
          <Button
            primary={downloadButtonColor === 'primary'}
            negative={downloadButtonColor === 'negative'}
            disabled={downloadButtonIsDisabled}
            onClick={() => alert('download!')}
          >
            {downloadButtonText}
          </Button>
        </Table.Cell>
      </Table.Row>
    );
  });

  return (
    <Fragment>
      <Header textAlign='left'>DOWNLOAD QUEUE</Header>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Date Added</Table.HeaderCell>
            <Table.HeaderCell>Track</Table.HeaderCell>
            <Table.HeaderCell>Artists</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{tableBody}</Table.Body>
      </Table>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    downloadQueue: state.downloadQueue,
  };
};

export default connect(mapStateToProps)(DownloadQueue);
