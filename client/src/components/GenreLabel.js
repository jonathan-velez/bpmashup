import React from 'react';
import { Link } from 'react-router-dom';
import { Label } from 'semantic-ui-react';

const GenreLabel = ({ genreName, genreSlug, genreId }) => {
  const url = `/genre/${genreSlug}/${genreId}/`;
  return (
    <Label as={Link} to={url} className='genre-label' color='grey'>
      {genreName}
    </Label>
  );
};

export default GenreLabel;
