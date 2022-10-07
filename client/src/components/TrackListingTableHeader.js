import React from 'react';
import { connect } from 'react-redux';
import { Checkbox, Table } from 'semantic-ui-react';
import {
  addAllTracksToSelectedList,
  removeAllTracksFromSelectedList,
} from '../actions/ActionCreators';

const TrackListingTableHeader = ({
  isPlaylist,
  addAllTracksToSelectedList,
  removeAllTracksFromSelectedList,
}) => {
  const handleToggleAllTracks = (checked) => {
    if (checked) {
      addAllTracksToSelectedList();
    } else {
      removeAllTracksFromSelectedList();
    }
  };

  return (
    <Table.Header fullWidth>
      <Table.Row>
        <Table.HeaderCell>
          <Checkbox
            onChange={(e, data) => handleToggleAllTracks(data.checked)}
          />
        </Table.HeaderCell>
        <Table.HeaderCell />
        <Table.HeaderCell />
        <Table.HeaderCell>TITLE</Table.HeaderCell>
        <Table.HeaderCell>ARTISTS</Table.HeaderCell>
        <Table.HeaderCell>LABEL</Table.HeaderCell>
        <Table.HeaderCell>GENRE</Table.HeaderCell>
        <Table.HeaderCell>BPM</Table.HeaderCell>
        <Table.HeaderCell>KEY</Table.HeaderCell>
        <Table.HeaderCell>PUBLISHED</Table.HeaderCell>
        {isPlaylist && <Table.HeaderCell>DATE ADDED</Table.HeaderCell>}
        <Table.HeaderCell>&nbsp;</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
  );
};

export default connect(
  null,
  { addAllTracksToSelectedList, removeAllTracksFromSelectedList },
)(TrackListingTableHeader);
