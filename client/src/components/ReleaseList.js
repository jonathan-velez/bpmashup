import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import ItemCards from './ItemCards';
import { fetchReleasesByArtistId } from '../thunks/releaseThunk';

const ReleaseList = ({ artistId, fetchReleasesByArtistId, releaseList }) => {
  useEffect(() => {
    if (artistId) {
      fetchReleasesByArtistId(artistId);
    }
  }, [artistId, fetchReleasesByArtistId]);

  const { releases = {} } = releaseList;

  return (
    <ItemCards
      items={Object.keys(releases).map((key) => releases[key])}
      itemType='release'
      showHeader={false}
    />
  );
};

const mapStateToProps = (state) => {
  const { releaseList } = state;
  return {
    releaseList,
  };
};

const mapDispatchToProps = {
  fetchReleasesByArtistId,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReleaseList);
