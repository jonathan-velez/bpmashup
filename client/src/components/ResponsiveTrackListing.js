import React from 'react';
import { Responsive } from 'semantic-ui-react';

import TrackListingTable from './TrackListingTable';
import TrackListingCards from './TrackListingCards';

const ResponsiveTrackListing = ({ trackListing, isPlaylist, isLoading, page, perPage }) => {
  return (
    <React.Fragment>
      <Responsive minWidth={700}>
        <TrackListingTable trackListing={trackListing} isPlaylist={isPlaylist} isLoading={isLoading} page={page} perPage={perPage} />
      </Responsive>
      <Responsive maxWidth={699}>
        <TrackListingCards trackListing={trackListing} isPlaylist={isPlaylist} isLoading={isLoading} page={page} perPage={perPage} />
      </Responsive>
    </React.Fragment>
  );
};

export default ResponsiveTrackListing;
