import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Responsive } from 'semantic-ui-react';

import TrackListingActionRow from './TrackListingActionRow';
import TrackListingCards from './TrackListingCards';
import TrackListingTable from './TrackListingTable';
import Pager from './Pager';
// import TrackListingSelectedItemsActionBar from './TrackListingSelectedItemsActionBar';

import { getPerPageSetting, getTracklistViewSetting } from '../utils/helpers';
import { removeAllTracksFromSelectedList } from '../actions/ActionCreators';

const TrackListingGroup = ({
  trackListing = {},
  removeAllTracksFromSelectedList,
}) => {
  const { tracks, metadata } = trackListing;

  useEffect(() => {
    return () => removeAllTracksFromSelectedList();
  }, [removeAllTracksFromSelectedList]);

  if (!tracks || tracks.length < 0) {
    return null;
  }
  const { totalPages, page, perPage, query } = metadata;
  return (
    <React.Fragment>
      <Responsive minWidth={700}>
        <TrackListingActionRow
          activePage={page}
          totalPages={totalPages}
          perPage={perPage}
        />
        {getTracklistViewSetting() === 'cards' ? (
          <TrackListingCards trackListing={tracks} />
        ) : (
          <TrackListingTable
            trackListing={tracks}
            isPlaylist={false}
            page={page}
            perPage={perPage}
          />
        )}
        <TrackListingActionRow
          activePage={page}
          totalPages={totalPages}
          perPage={perPage}
        />
      </Responsive>
      <Responsive maxWidth={699}>
        <TrackListingCards trackListing={tracks} />
      </Responsive>
      {totalPages > 1 && (
        <Pager
          activePage={page}
          totalPages={totalPages}
          firstItem={null}
          lastItem={null}
          perPage={perPage || getPerPageSetting()}
          query={query}
        />
      )}
    </React.Fragment>
  );
};

export default connect(
  null,
  { removeAllTracksFromSelectedList },
)(TrackListingGroup);
