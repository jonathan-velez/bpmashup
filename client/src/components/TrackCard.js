import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Label } from 'semantic-ui-react';

import AddToPlaylist from './AddToPlaylist';
import TrackAlbum from './TrackAlbum';
import DownloadTrack from './DownloadTrack';
import LoveItem from './LoveItem';
import { constructLinks, trackGenreColors } from '../utils/trackUtils';
import { musicalKeyFilter } from '../utils/helpers';

class Track extends React.Component {
  state = {
    active: false,
  }

  handleShow = () => this.setState({ active: true });
  handleHide = () => this.setState({ active: false });

  render() {
    const { track } = this.props;

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
          {track.position && <Label attached='top left' color='grey' ribbon>{track.position}</Label>}
          <Card.Header className='track-title'>{track.title}</Card.Header>
          <Card.Content>{constructLinks(track.artists, 'artist')}</Card.Content>
          <Card.Content><Link to={`/label/${track.label.slug}/${track.label.id}`}>[{track.label.name}]</Link></Card.Content>
          <Card.Content>{constructLinks(track.genres, 'genre')}</Card.Content>
          <Card.Meta><b>BPM:</b> {track.bpm} <b>Key:</b> {musicalKeyFilter(track.key && track.key.shortName)}</Card.Meta>
          <Card.Meta><b>Released:</b> {track.releaseDate}</Card.Meta>
          <Card.Content><Link to={`/similar-tracks/${track.slug}/${track.id}`}>Similar tracks</Link></Card.Content>
        </Card.Content>
        <Card.Content extra>
          <div className='ui three buttons'>
            <DownloadTrack track={track} />
            <LoveItem type='track' item={track} />
            <AddToPlaylist track={track} />
          </div>
        </Card.Content>
      </Card >
    )
  }
}

export default Track;