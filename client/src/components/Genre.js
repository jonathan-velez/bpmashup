import React from 'react';
import { Helmet } from 'react-helmet';
import _ from 'lodash';

import GenreCharts from './GenreCharts';
import MostPopularTracks from './MostPopularTracks';
import { DEFAULT_PAGE_TITLE } from '../constants/defaults';
import { deslugify } from '../utils/helpers';

const Genre = (props) => {
  const { match = {} } = props;
  const { params = {} } = match;
  const { genreId, genreName } = params;

  return (
    <>
      <Helmet>
        <title>
          {genreName
            ? `${_.startCase(deslugify(genreName))} Top Charts & Tracks :: `
            : ``}
          {DEFAULT_PAGE_TITLE}
        </title>
      </Helmet>
      <GenreCharts genreId={genreId} genreName={genreName} />
      <MostPopularTracks
        searchType='genre'
        searchId={genreId}
        searchName={genreName}
        {...props}
      />
    </>
  );
};

export default Genre;
