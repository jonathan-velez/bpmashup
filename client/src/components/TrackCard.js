import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Label } from 'semantic-ui-react';
import { connect } from 'react-redux';

import TrackAlbum from './TrackAlbum';
import TrackCardActionRow from './TrackCardActionRow';
import { constructLinks, trackGenreColors, constructTrackLink } from '../utils/trackUtils';
import { hasZippyPermission } from '../selectors';

class TrackCard extends React.Component {
  state = {
    active: false,
  }

  handleShow = () => this.setState({ active: true });
  handleHide = () => this.setState({ active: false });

  render() {
    const { 
      track,
      showPosition = true,
      canZip,
    } = this.props;

    return (
      <Card
        className='flex-card'
        id={`track-${track.id}`}
        color={trackGenreColors[track.genres[0].name.toLowerCase()]}
        raised
      >
        <TrackAlbum
          imageUrl={track.images.large.secureUrl}
          track={track}
        />
        <Card.Content>
          {track.position && showPosition && <Label attached='top left' color='grey' ribbon>{track.position}</Label>}
          <Card.Header className='track-title'>{constructTrackLink(track)}</Card.Header>
          <Card.Content>{constructLinks(track.artists, 'artist')}</Card.Content>
          <Card.Content><Link to={`/label/${track.label.slug}/${track.label.id}`}>[{track.label.name}]</Link></Card.Content>
        </Card.Content>
        <Card.Content extra>
          <TrackCardActionRow canZip={canZip} numOfButtons={'three'} track={track} />
        </Card.Content>
      </Card >
    )
  }
}

const mapStateToProps = state => {
  return {
    canZip: hasZippyPermission(state),
  }
}

export default connect(mapStateToProps, null)(TrackCard);
