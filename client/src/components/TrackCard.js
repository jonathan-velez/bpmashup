import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Label } from 'semantic-ui-react';
import { connect } from 'react-redux';

import TrackAlbum from './TrackAlbum';
import TrackCardActionRow from './TrackCardActionRow';
import {
  constructLinks,
  trackGenreColors,
  constructTrackLink,
} from '../utils/trackUtils';
import { musicalKeyFilter } from '../utils/helpers';
import { hasZippyPermission } from '../selectors';

const TrackCard = ({ track, showPosition = true, canZip }) => {
  const {
    id,
    genres = [],
    images = {},
    position,
    artists = [],
    label = {},
    releaseDate,
    key,
  } = track;
  return (
    <Card
      className='flex-card'
      id={`track-${id}`}
      color={trackGenreColors[genres[0].name.toLowerCase()]}
      raised
    >
      <TrackAlbum
        imageUrl={images.large && images.large.secureUrl}
        track={track}
      />
      <Card.Content>
        {position && showPosition && (
          <Label attached='top left' color='grey' ribbon>
            {position}
          </Label>
        )}
        <Card.Header className='track-title'>
          {constructTrackLink(track)}
        </Card.Header>
        <Card.Content>{constructLinks(artists, 'artist')}</Card.Content>
        <Card.Content>
          <Link to={`/label/${label.slug}/${label.id}`}>[{label.name}]</Link>
        </Card.Content>
        <Card.Content>{constructLinks(genres, 'genre')}</Card.Content>
        <Card.Content>{releaseDate}</Card.Content>
        <Card.Content>{musicalKeyFilter(key && key.shortName)}</Card.Content>
      </Card.Content>
      <Card.Content extra>
        <TrackCardActionRow
          canZip={canZip}
          numOfButtons={'three'}
          track={track}
        />
      </Card.Content>
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    canZip: hasZippyPermission(state),
  };
};

export default connect(
  mapStateToProps,
  null,
)(TrackCard);
