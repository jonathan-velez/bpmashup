import React from 'react';
import GenreCharts from './GenreCharts';
import MostPopularTracks from './MostPopularTracks';

const Genre = (props) => {
  const { match = {} } = props;
  const { params = {} } = match;
  const { genreId, genreName } = params;

  return (
    <React.Fragment>
      <GenreCharts genreId={genreId} genreName={genreName} />
      <MostPopularTracks
        searchType='genre'
        searchId={genreId}
        searchName={genreName}
        {...props}
      />
    </React.Fragment>
  );
};

export default Genre;
