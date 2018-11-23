import React from 'react';
import { Table, Header, Message } from 'semantic-ui-react';

import TrackListingTableHeader from './TrackListingTableHeader';
import TrackListingTableBody from './TrackListingTableBody';

const TrackListingTable = ({ trackListing, isPlaylist, page, perPage }) => {
  return (Object.keys(trackListing).length > 0 ?
    <Table striped>
      <TrackListingTableHeader />
      <TrackListingTableBody trackListing={trackListing} isPlaylist={isPlaylist} page={page} perPage={perPage} />
    </Table>
    :
    <Message warning>
      <Header size='huge'>Hey!</Header>
      <p>This tracklist is empty!</p>
    </Message>
  )
}

export default TrackListingTable;
