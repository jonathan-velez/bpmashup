import React from 'react';

import TrackListingActionRow from './TrackListingActionRow';
import TrackListingCards from './TrackListingCards';
import TrackListingTable from './TrackListingTable';
import Pager from './Pager';

import { getPerPageSetting, getTracklistViewSetting } from '../utils/helpers';

const TrackListingGroup = ({ trackListing = {} }) => {
  const { tracks, metadata } = trackListing;

  if (!tracks || tracks.length < 0) {
    return null;
  }
  const { totalPages, page, perPage, query } = metadata;
  return (
    <React.Fragment>
      <TrackListingActionRow activePage={page} totalPages={totalPages} perPage={perPage} />
      {getTracklistViewSetting() === 'cards' ?
        <TrackListingCards trackListing={tracks} />
        :
        <TrackListingTable trackListing={tracks} isPlaylist={false} page={page} perPage={perPage} />
      }
      {totalPages > 1 &&
        <Pager activePage={page} totalPages={totalPages} firstItem={null} lastItem={null} perPage={perPage || getPerPageSetting()} query={query} />
      }
    </React.Fragment>
  );
};

export default TrackListingGroup;
