import React from 'react';
import { Table } from 'semantic-ui-react';

const TrackListingTableHeader = ({ isPlaylist }) => {
  return (
    <Table.Header fullWidth>
      <Table.Row>
        <Table.HeaderCell />
        <Table.HeaderCell />
        <Table.HeaderCell>TITLE</Table.HeaderCell>
        <Table.HeaderCell>ARTISTS</Table.HeaderCell>
        <Table.HeaderCell>LABEL</Table.HeaderCell>
        <Table.HeaderCell>GENRE</Table.HeaderCell>
        <Table.HeaderCell>BPM</Table.HeaderCell>
        <Table.HeaderCell>KEY</Table.HeaderCell>
        <Table.HeaderCell>RELEASED</Table.HeaderCell>
        {isPlaylist && <Table.HeaderCell>DATE ADDED</Table.HeaderCell>}
        <Table.HeaderCell>&nbsp;</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
  );
};

export default TrackListingTableHeader;
