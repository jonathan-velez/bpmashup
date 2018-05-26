import React from 'react';
import _ from 'lodash';
import { Table, Icon, Image } from 'semantic-ui-react';

import TrackAlbum from './TrackAlbum';
import DownloadTrack from './DownloadTrack';

const TrackListingTableBody = ({ trackListing, removeFromPlaylist }) => {
  let trackListingBody = '';

  if (Object.keys(trackListing).length > 0) {
    const orderedTracks = _.orderBy(trackListing, 'position', 'asc');
    trackListingBody = _.map(orderedTracks, track => {
      return (
        <Table.Row key={track.id}>          
          <Table.Cell>
            <TrackAlbum              
              imageUrl={track.images.large.secureUrl}              
              imageSize={'tiny'}
              track={track}              
            />
          </Table.Cell>
          <Table.Cell>{track.title}</Table.Cell>
          <Table.Cell>{track.artists[0].name}</Table.Cell>
          <Table.Cell>{track.label.name}</Table.Cell>
          <Table.Cell>{track.genres[0].name}</Table.Cell>
          <Table.Cell>{track.releaseDate}</Table.Cell>
          <Table.Cell><DownloadTrack track={track} mini /></Table.Cell>
          <Table.Cell onClick={() => removeFromPlaylist(track.id.toString())}><Icon name='delete' /></Table.Cell>
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

  return <Table.Body>{trackListingBody}</Table.Body>;
};

export default TrackListingTableBody;