import React from 'react';
import _ from 'lodash';
import { Table } from 'semantic-ui-react';

import TrackListingTableRow from './TrackListingTableRow';

const TrackListingTableBody = React.memo(({ trackListing, isPlaylist }) => {
  if (Object.keys(trackListing).length === 0) {
    return (
      <Table.Row>
        <Table.Cell singleLine textAlign='center'>No tracks added!</Table.Cell>
      </Table.Row>
    )
  }

  // sort by the order it was added to the playlist
  const orderBy = isPlaylist ? 'timeStamp' : 'position';
  const orderedTracks = _.orderBy(trackListing, orderBy, 'asc');

  const trackListingBody = _.map(orderedTracks, (track, idx) => {
    return (
      <TrackListingTableRow key={`${track.id}-${idx}`} idx={idx} track={track} isPlaylist={isPlaylist} />
    )
  });

  return (
    <Table.Body>{trackListingBody}</Table.Body>
  );
});

export default TrackListingTableBody;
