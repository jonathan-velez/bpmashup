import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getLovedLabelIds, getLovedArtistIds } from '../selectors';
import { getLatestTracksByLabelAndArtistIds } from '../thunks';
import TitleHeader from './TitleHeader';
import TrackListingGroup from './TrackListingGroup';
import NothingHereMessage from './NothingHereMessage';

const LatestFromMyLoves = ({
  lovedLabelIds = [],
  lovedArtistIds = [],
  trackListing = {},
  getLatestTracksByLabelAndArtistIds,
}) => {
  useEffect(() => {
    // TODO: Remove this check as it could be possible that they have no loves yet
    // We ultimately need to confirm their loves have been loaded in storeUtils.
    // Don't currently have a flag or reliable way of knowing this event is complete
    // This is really only an issue if you load the site on this component
    // If you load elsewhere and navigate here, it will be loaded and useEffect should only run once
    // possible solution - wrap onSnapshot in a promise https://stackoverflow.com/questions/51793842/wait-for-firebase-to-load-onsnapshot

    // if (lovedArtistIds.length > 0 && lovedLabelIds.length > 0) {
    getLatestTracksByLabelAndArtistIds(lovedLabelIds, lovedArtistIds);
    // }
  }, [lovedArtistIds, lovedLabelIds, getLatestTracksByLabelAndArtistIds]);

  if (lovedLabelIds.length <= 0 || lovedArtistIds.length <= 0) {
    return <NothingHereMessage />;
  }

  return (
    <>
      <TitleHeader headerTitle='Latest tracks from your Loves' />
      <TrackListingGroup trackListing={trackListing} />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    lovedLabelIds: getLovedLabelIds(state),
    lovedArtistIds: getLovedArtistIds(state),
    trackListing: state.trackListing,
  };
};

export default connect(
  mapStateToProps,
  { getLatestTracksByLabelAndArtistIds },
)(LatestFromMyLoves);
