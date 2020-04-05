import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Table } from 'semantic-ui-react';

import TrackAlbum from './TrackAlbum';
import TrackActionDropdown from './TrackActionDropdown';
import { constructLinks, constructTrackLink } from '../utils/trackUtils';
import { musicalKeyFilter } from '../utils/helpers';
import { trackHasBeenDownloaded } from '../selectors';

const TrackListingTableRow = ({ idx, track, isPlaylist, trackHasBeenDownloaded }) => {
  const { id, images, artists, genres, label, bpm, key, releaseDate, position, dateAdded } = track;
  const dateAddedFormatted = dateAdded ? moment.unix(dateAdded).format('YYYY-MM-DD') : '????-??-??';

  return (
    <Table.Row key={id} id={`track-${id}`} negative={trackHasBeenDownloaded}>
      <Table.Cell>
        {isPlaylist ? idx + 1 : position}
      </Table.Cell>
      <Table.Cell>
        <TrackAlbum
          imageUrl={images.medium.secureUrl}
          imageSize='tiny'
          iconSize='big'
          track={track}
        />
      </Table.Cell>
      <Table.Cell>{constructTrackLink(track)}</Table.Cell>
      <Table.Cell>{constructLinks(artists, 'artist')}</Table.Cell>
      <Table.Cell><Link to={`/label/${label.slug}/${label.id}`}>{label.name}</Link></Table.Cell>
      <Table.Cell>{constructLinks(genres, 'genre')}</Table.Cell>
      <Table.Cell>{bpm}</Table.Cell>
      <Table.Cell>{musicalKeyFilter(key && key.shortName)}</Table.Cell>
      <Table.Cell>{releaseDate}</Table.Cell>
      {isPlaylist &&
        <Table.Cell>{dateAddedFormatted}</Table.Cell>
      }
      <Table.Cell>
        <TrackActionDropdown track={track} />
      </Table.Cell>
    </Table.Row>
  );
};

const mapStateToProps = (state, props) => {
  return {
    trackHasBeenDownloaded: trackHasBeenDownloaded(state, props.track.id),
  }
}

export default connect(mapStateToProps)(TrackListingTableRow);
