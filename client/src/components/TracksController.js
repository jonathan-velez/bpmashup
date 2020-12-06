import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import TrackListingGroup from './TrackListingGroup';
import TitleHeader from './TitleHeader';
import FilterBar from './FilterBar';
import { getTracks } from '../thunks';
import { usePrevious } from '../hooks';
import { DEFAULT_PAGE_TITLE } from '../constants/defaults';
import { deslugify } from '../utils/helpers';

const TracksController = ({
  filterBar,
  trackQuery,
  trackListing,
  getTracks,
  match,
}) => {
  const previousTrackQuery = usePrevious(trackQuery);
  const { params = {} } = match;
  const { itemName } = params;

  useEffect(() => {
    const fetchTracks = (trackQuery) => {
      getTracks(trackQuery);
    };

    if (
      !previousTrackQuery ||
      (previousTrackQuery && !_.isEqual(previousTrackQuery, trackQuery))
    ) {
      fetchTracks(trackQuery);
    }
  }, [trackQuery, getTracks, previousTrackQuery]);

  return (
    <>
      <Helmet>
        <title>
          Tracks
          {itemName ? ` by ${_.startCase(deslugify(itemName))} ` : ` `}
          {`:: ${DEFAULT_PAGE_TITLE}`}
        </title>
      </Helmet>
      <TitleHeader headerPrefix='TRACKS' headerTitle={itemName} />
      {filterBar && <FilterBar />}
      <TrackListingGroup trackListing={trackListing} />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    trackListing: state.trackListing,
  };
};

const mapDispatchToProps = { getTracks };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TracksController));
