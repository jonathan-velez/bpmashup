import React from 'react';
import GenreCharts from './GenreCharts';
import TrackListingController from './TrackListingController';

const Genre = (props) => {
  const { match = {} } = props;
  const { params = {} } = match;
  const { genreId, genreName } = params;

  return (
    <React.Fragment>
      <GenreCharts genreId={genreId} genreName={genreName} />
      <TrackListingController {...props} />
    </React.Fragment>
  );
};

export default Genre;
