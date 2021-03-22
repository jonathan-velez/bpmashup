import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'semantic-ui-react';
import { connect } from 'react-redux';

import TrackAlbum from './TrackAlbum';
import TrackCardActionRow from './TrackCardActionRow';
import {
  constructLinks,
  trackGenreColors,
  constructTrackLink,
} from '../utils/trackUtils';
// import { musicalKeyFilter } from '../utils/helpers';
import { hasZippyPermission } from '../selectors';

const TrackCard = ({ track, canZip }) => {
  const {
    id,
    genre = {},
    // image: waveFormImage = {},
    artists = [],
    publish_date,
    key,
    bpm,
    release,
  } = track;
  const { image, label } = release;
  const { id: labelId, name: labelName, slug: labelSlug } = label;

  return (
    <Card
      className='flex-card'
      id={`track-${id}`}
      color={trackGenreColors[genre.name.toLowerCase()]}
      raised
    >
      <TrackAlbum imageUrl={image.uri} track={track} />
      <Card.Content>
        <Card.Header className='track-title'>
          {constructTrackLink(track)}
        </Card.Header>
        <Card.Content>{constructLinks(artists, 'artist')}</Card.Content>
        <Card.Content>
          <Link to={`/label/${labelSlug}/${labelId}`}>[{labelName}]</Link>
        </Card.Content>
        <Card.Content>{constructLinks([genre], 'genre')}</Card.Content>
        <Card.Content>{publish_date}</Card.Content>
        <Card.Content>
          {key.camelot_number}
          {key.camelot_letter}
        </Card.Content>
        <Card.Content>{bpm} BPM</Card.Content>
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
