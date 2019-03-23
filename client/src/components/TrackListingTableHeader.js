import React from 'react';
import { Table } from 'semantic-ui-react';

const TrackListingTableHeader = ({ isPlaylist }) => {
  return (
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>&nbsp;</Table.HeaderCell>
        <Table.HeaderCell>&nbsp;</Table.HeaderCell>
        <Table.HeaderCell>Title</Table.HeaderCell>
        <Table.HeaderCell>Artists</Table.HeaderCell>
        <Table.HeaderCell>Label</Table.HeaderCell>
        <Table.HeaderCell>Genre</Table.HeaderCell>
        <Table.HeaderCell>BPM</Table.HeaderCell>
        <Table.HeaderCell>Key</Table.HeaderCell>
        <Table.HeaderCell>Released</Table.HeaderCell>
        {isPlaylist && 
          <Table.HeaderCell>Date Added</Table.HeaderCell>
        }
        <Table.HeaderCell>&nbsp;</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
  );
};

export default TrackListingTableHeader;