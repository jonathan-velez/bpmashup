import React from 'react';
import _ from 'lodash';
import { Table } from 'semantic-ui-react';

import TrackListingTableRow from './TrackListingTableRow';

class TrackListingTableBody extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !_.isEqual(nextProps, this.props);
  }

  render() {
    const { trackListing, isPlaylist } = this.props;
    let trackListingBody = '';

    if (Object.keys(trackListing).length > 0) {
      // sort by the order it was added to the playlist
      const orderBy = isPlaylist ? 'timeStamp' : 'position';
      const orderedTracks = _.orderBy(trackListing, orderBy, 'asc');

      trackListingBody = _.map(orderedTracks, (track, idx) => {
        return (
          <TrackListingTableRow idx={idx} track={track} isPlaylist={isPlaylist} />
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
      <Table.Body>{trackListingBody}</Table.Body>
    );
  }
}

export default TrackListingTableBody;
