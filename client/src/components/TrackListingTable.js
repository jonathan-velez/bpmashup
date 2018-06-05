import React from 'react';
import { Table, Dimmer, Loader, Header, Message } from 'semantic-ui-react';

import TrackListingTableHeader from './TrackListingTableHeader';
import TrackListingTableBody from './TrackListingTableBody';

const TrackListingTable = ({ trackListing, isLoading, removeFromPlaylist }) => {
  if (isLoading) {
    return (
      <Dimmer active>
        <Loader content='Loading' />
      </Dimmer>
    )
  }

  return (Object.keys(trackListing).length > 0 ?
    <Table striped>
      <TrackListingTableHeader />
      <TrackListingTableBody trackListing={trackListing} removeFromPlaylist={removeFromPlaylist} />
    </Table>
    :
    <Message warning>
      <Header size='huge'>Hey!</Header>
      <p>This tracklist is empty!</p>
    </Message >
  )
}

export default TrackListingTable;