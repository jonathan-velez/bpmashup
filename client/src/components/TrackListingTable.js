import React from 'react';
import { Table } from 'semantic-ui-react';

import TrackListingTableHeader from './TrackListingTableHeader';
import TrackListingTableBody from './TrackListingTableBody';
import NothingHereMessage from './NothingHereMessage';

const TrackListingTable = ({ trackListing, isPlaylist, isLoading, page, per_page }) => {
  if (isLoading) return null;

  return (Object.keys(trackListing).length > 0 ?
    <Table striped unstackable padded>
      <TrackListingTableHeader isPlaylist={isPlaylist} />
      <TrackListingTableBody trackListing={trackListing} isPlaylist={isPlaylist} page={page} per_page={per_page} />
    </Table>
    :
    <NothingHereMessage />
  )
}

export default TrackListingTable;
