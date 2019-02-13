import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Table, Transition } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';

import TrackAlbum from './TrackAlbum';
import TrackActionDropdown from './TrackActionDropdown';
import { constructLinks } from '../utils/trackUtils';
import { musicalKeyFilter } from '../utils/helpers';

const TrackListingTableBody = ({ trackListing, downloadedTracks, isPlaylist = true }) => {
  let trackListingBody = '';

  if (Object.keys(trackListing).length > 0) {
    // sort by the order it was added to the playlist
    const orderBy = isPlaylist ? 'timeStamp' : 'position';
    const orderedTracks = _.orderBy(trackListing, orderBy, 'asc');

    trackListingBody = _.map(orderedTracks, (track, idx) => {
      const hasBeenDownloaded = downloadedTracks.includes(track.id && track.id.toString());
      return (
        <Table.Row key={track.id} id={`track-${track.id}`} negative={hasBeenDownloaded}>
          <Table.Cell>
            {isPlaylist ? idx + 1 : track.position}
          </Table.Cell>
          <Table.Cell>
            <TrackAlbum
              imageUrl={track.images.large.secureUrl}
              imageSize='tiny'
              iconSize='big'
              track={track}
            />
          </Table.Cell>
          <Table.Cell>{track.title}</Table.Cell>
          <Table.Cell>{constructLinks(track.artists, 'artist')}</Table.Cell>
          <Table.Cell><Link to={`/label/${track.label.slug}/${track.label.id}`}>{track.label.name}</Link></Table.Cell>
          <Table.Cell>{constructLinks(track.genres, 'genre')}</Table.Cell>
          <Table.Cell>{track.bpm}</Table.Cell>
          <Table.Cell>{musicalKeyFilter(track.key && track.key.shortName)}</Table.Cell>
          <Table.Cell>{track.releaseDate}</Table.Cell>
          <Table.Cell>
            <TrackActionDropdown track={track} />
          </Table.Cell>
        </Table.Row>
      )
    });
  } else {
    trackListingBody = (
      <Table.Row>
        <Table.Cell singleLine textAlign='center'>No tracks added!</Table.Cell>
      </Table.Row>
    )
  }

  return (
    <Transition.Group
      as={Table.Body}
      animation='fade'
      duration={400}
    >
      {trackListingBody}
    </Transition.Group>
  );
};


const mapStateToProps = state => {
  return {
    downloadedTracks: state.downloadedTracks,
  }
}

export default withRouter(connect(mapStateToProps, {})(TrackListingTableBody));
