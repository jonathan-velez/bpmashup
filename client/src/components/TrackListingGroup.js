import React from 'react';

import TrackListingActionRow from './TrackListingActionRow';
import TrackListingCards from './TrackListingCards';
import TrackListingTable from './TrackListingTable';
import Pager from './Pager';

import { getPerPageSetting } from '../utils/helpers';

const TrackListingGroup = ({ trackListing = {} }) => {
  const { tracks, metadata, tracklistView } = trackListing;

  if (!tracks || tracks.length < 0) {
    return null;
  }
  const { totalPages, page, perPage, query } = metadata;
  return (
    <React.Fragment>
      <TrackListingActionRow activePage={page} totalPages={totalPages} perPage={perPage} />
      {tracklistView === 'cards' ?
        <TrackListingCards trackListing={tracks} />
        :
        <TrackListingTable trackListing={tracks} isPlaylist={false} page={page} perPage={perPage} />
      }
      {totalPages > 1 ?
        <Pager activePage={page} totalPages={totalPages} firstItem={null} lastItem={null} perPage={perPage || getPerPageSetting()} query={query} />
        :
        null
      }
    </React.Fragment>
  );
};

export default TrackListingGroup;
