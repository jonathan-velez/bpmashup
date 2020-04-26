import React from 'react';
import TrackListingGroup from './TrackListingGroup';

const ResponsiveTrackListing = ({
  trackListing,
  isPlaylist,
  isLoading,
  page,
  perPage,
}) => {
  return (
    <TrackListingGroup
      trackListing={trackListing}
      isPlaylist={isPlaylist}
      isLoading={isLoading}
      page={page}
      perPage={perPage}
    />
  );
};

export default ResponsiveTrackListing;
