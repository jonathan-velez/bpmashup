import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Checkbox, Table } from 'semantic-ui-react';

import TrackAlbum from './TrackAlbum';
import TrackActionDropdown from './TrackActionDropdown';
import { constructLinks, constructTrackLink } from '../utils/trackUtils';
import { getCamelotKey } from '../utils/helpers';
import { trackHasBeenDownloaded, isTrackSelected } from '../selectors';
import {
  addTrackToSelectedList,
  removeTrackFromSelectedList,
} from '../actions/ActionCreators';

const TrackListingTableRow = ({
  idx,
  track,
  isPlaylist,
  trackHasBeenDownloaded,
  isSelected,
  addTrackToSelectedList,
  removeTrackFromSelectedList,
}) => {
  const {
    id,
    // images,
    artists = [],
    genre = {},
    // label,
    bpm,
    key,
    publish_date,
    dateAdded = {},
    release,
  } = track;
  const { image, label } = release;
  const { id: labelId, name: labelName, slug: labelSlug } = label;

  const { seconds } = dateAdded;
  const dateAddedFormatted = seconds
    ? moment.unix(seconds).format('YYYY-MM-DD')
    : '????-??-??';

  const handleAddTracktoSelectedTracks = (id, checked) => {
    if (checked) {
      addTrackToSelectedList(id);
    } else {
      removeTrackFromSelectedList(id);
    }
  };

  return (
    <Table.Row key={id} id={`track-${id}`} negative={trackHasBeenDownloaded}>
      <Table.Cell>
        <Checkbox
          onChange={(e, data) => {
            e.stopPropagation();
            handleAddTracktoSelectedTracks(id, data.checked);
          }}
          checked={isSelected}
        />
      </Table.Cell>
      <Table.Cell>{isPlaylist ? idx + 1 : ''}</Table.Cell>
      <Table.Cell>
        <TrackAlbum
          imageUrl={image.uri}
          imageSize='tiny'
          iconSize='big'
          track={track}
        />
      </Table.Cell>
      <Table.Cell>{constructTrackLink(track)}</Table.Cell>
      <Table.Cell>{constructLinks(artists, 'artist')}</Table.Cell>
      <Table.Cell>
        <Link to={`/label/${labelSlug}/${labelId}`}>[{labelName}]</Link>
      </Table.Cell>
      <Table.Cell>{constructLinks([genre], 'genre')}</Table.Cell>
      <Table.Cell>{bpm}</Table.Cell>
      <Table.Cell>{getCamelotKey(key)}</Table.Cell>
      <Table.Cell>{publish_date}</Table.Cell>
      {isPlaylist && <Table.Cell>{dateAddedFormatted}</Table.Cell>}
      <Table.Cell>
        <TrackActionDropdown track={track} />
      </Table.Cell>
    </Table.Row>
  );
};

const mapStateToProps = (state, props) => {
  return {
    trackHasBeenDownloaded: trackHasBeenDownloaded(state, props.track.id),
    isSelected: isTrackSelected(state, props.track.id),
  };
};

export default connect(
  mapStateToProps,
  { addTrackToSelectedList, removeTrackFromSelectedList },
)(TrackListingTableRow);
