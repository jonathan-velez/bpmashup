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
  let { totalPages, page, per_page, query } = metadata;
  
  // page comes in as "1/2". we need just the page
  const pageSlashPos = page && page.indexOf('/');
  if(pageSlashPos >= 0){
    page = page.substring(0, page.indexOf('/'));
  }

  return (
    <React.Fragment>
      <Responsive minWidth={700}>
        <TrackListingActionRow
          activePage={page}
          totalPages={totalPages}
          per_page={per_page}
        />
        {getTracklistViewSetting() === 'cards' ? (
          <TrackListingCards trackListing={tracks} />
        ) : (
          <TrackListingTable
            trackListing={tracks}
            isPlaylist={false}
            page={page}
            per_page={per_page}
          />
        )}
        <TrackListingActionRow
          activePage={page}
          totalPages={totalPages}
          per_page={per_page}
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
          per_page={per_page || getPerPageSetting()}
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
