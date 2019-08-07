import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { Table, Header, Image } from 'semantic-ui-react';

const LovedArtistsTable = (artistDetails) => {
  const { artists } = artistDetails;
  if (!artists || artists.length === 0) return null;

  const orderedArtists = _.sortBy(artists, 'lastPublishDate').reverse();
  const lovedArtistsDetails = orderedArtists.map(artist => {
    return (
      <Table.Row key={artist.id}>
        <Table.Cell>
          <Header as='h4' image>
            <Image src={artist.images.large.secureUrl} rounded size='mini' />
            <Header.Content>
              <Link to={`/artist/${artist.slug}/${artist.id}`}>{artist.name}</Link>
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>
          {artist.lastPublishDate}
        </Table.Cell>
      </Table.Row>
    )
  });
  return (
    <React.Fragment>
      <Header size='huge' textAlign='left' dividing>Artists</Header>
      <Table basic='very' celled collapsing>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Artist</Table.HeaderCell>
            <Table.HeaderCell>Last Publish Date</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {lovedArtistsDetails}
        </Table.Body>
      </Table>
    </React.Fragment>
  );
};

export default LovedArtistsTable;
