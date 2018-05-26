import React from 'react';
import { Table } from 'semantic-ui-react';

const TrackListingTableHeader = () => {
  return (
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>&nbsp;</Table.HeaderCell>
        <Table.HeaderCell>&nbsp;</Table.HeaderCell>
        <Table.HeaderCell>Title</Table.HeaderCell>
        <Table.HeaderCell>Artists</Table.HeaderCell>
        <Table.HeaderCell>Label</Table.HeaderCell>
        <Table.HeaderCell>Genre</Table.HeaderCell>
        <Table.HeaderCell>Released</Table.HeaderCell>
        <Table.HeaderCell>Download</Table.HeaderCell>
        <Table.HeaderCell>&nbsp;</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
  );
};

export default TrackListingTableHeader;