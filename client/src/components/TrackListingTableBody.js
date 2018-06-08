import React from 'react';
import _ from 'lodash';
import { Table, Icon, Transition, Dropdown } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';

import TrackAlbum from './TrackAlbum';
import { constructLinks, downloadTrack } from '../utils/trackUtils';
import { musicalKeyFilter } from '../utils/helpers';

const TrackListingTableBody = ({ trackListing, removeFromPlaylist, history }) => {
  let trackListingBody = '';

  if (Object.keys(trackListing).length > 0) {
    // sort by the order it was added to the playlist
    const orderedTracks = _.orderBy(trackListing, 'timeStamp', 'asc');

    trackListingBody = _.map(orderedTracks, (track, idx) => {
      return (
        <Table.Row key={track.id}>
          <Table.Cell>
            {idx + 1}
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
          <Table.Cell><Link to={`/most-popular/label/${track.label.slug}/${track.label.id}`}>{track.label.name}</Link></Table.Cell>
          <Table.Cell>{constructLinks(track.genres, 'genre')}</Table.Cell>
          <Table.Cell>{track.bpm}</Table.Cell>
          <Table.Cell>{musicalKeyFilter(track.key && track.key.shortName)}</Table.Cell>
          <Table.Cell>{track.releaseDate}</Table.Cell>
          <Table.Cell>
            <Dropdown icon='chevron down' floating button className='icon'>
              <Dropdown.Menu>
                <Dropdown.Item icon='download' text='Download' onClick={() => downloadTrack(track)} />
                <Dropdown.Item icon='delete' text='Delete' onClick={() => removeFromPlaylist(track.id.toString())} />
                <Dropdown.Item icon='search' text='Similar Tracks' onClick={() => history.push(`/similar-tracks/${track.slug}/${track.id}`)} />
              </Dropdown.Menu>
            </Dropdown>
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
      animation='slide right'
      duration={500}
    >
      {trackListingBody}
    </Transition.Group>
  );
};

export default withRouter(TrackListingTableBody);
