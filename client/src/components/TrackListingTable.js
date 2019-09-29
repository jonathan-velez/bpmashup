import React from 'react';
import { Table } from 'semantic-ui-react';

import TrackListingTableHeader from './TrackListingTableHeader';
import TrackListingTableBody from './TrackListingTableBody';
import NothingHereMessage from './NothingHereMessage';

const TrackListingTable = ({ trackListing, isPlaylist, isLoading, page, perPage }) => {
  if (isLoading) return null;

  return (Object.keys(trackListing).length > 0 ?
    <Table striped unstackable>
      <TrackListingTableHeader isPlaylist={isPlaylist} />
      <TrackListingTableBody trackListing={trackListing} isPlaylist={isPlaylist} page={page} perPage={perPage} />
    </Table>
    :
    <NothingHereMessage />
  )
}

export default TrackListingTable;
