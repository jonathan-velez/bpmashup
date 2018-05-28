import React from 'react';
import { Table, Dimmer, Loader } from 'semantic-ui-react';

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

  return (
    <Table striped>
      <TrackListingTableHeader />
      <TrackListingTableBody trackListing={trackListing} removeFromPlaylist={removeFromPlaylist} />
    </Table>
  )
}

export default TrackListingTable;