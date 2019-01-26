import React from 'react';
import { Link } from 'react-router-dom';
import { Label } from 'semantic-ui-react';

const GenreLabel = ({ genreName, genreSlug, genreId }) => {
  const url = `/most-popular/genre/${genreSlug}/${genreId}/`;
  return (
    <Label as={Link} to={url} className='genre-label'>
      {genreName}
    </Label>
  );
};

export default GenreLabel;
