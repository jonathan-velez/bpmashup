import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { Table, Transition } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';

import TrackAlbum from './TrackAlbum';
import TrackActionDropdown from './TrackActionDropdown';
import { constructLinks, constructTrackLink } from '../utils/trackUtils';
import { musicalKeyFilter } from '../utils/helpers';

class TrackListingTableBody extends React.Component {
  shouldComponentUpdate(nextProps){
    return !_.isEqual(nextProps, this.props);
  }

  render() {
    const { trackListing, downloadedTracks, isPlaylist } = this.props;
    let trackListingBody = '';

    if (Object.keys(trackListing).length > 0) {
      // sort by the order it was added to the playlist
      const orderBy = isPlaylist ? 'timeStamp' : 'position';
      const orderedTracks = _.orderBy(trackListing, orderBy, 'asc');

      trackListingBody = _.map(orderedTracks, (track, idx) => {
        const { id, images, artists, genres, label, bpm, key, releaseDate, position, dateAdded } = track;
        const hasBeenDownloaded = downloadedTracks.includes(id);
        const dateAddedFormatted = dateAdded ? moment.unix(dateAdded).format('YYYY-MM-DD') : '????-??-??';

        return (
          <Table.Row key={id} id={`track-${id}`} negative={hasBeenDownloaded}>
            <Table.Cell>
              {isPlaylist ? idx + 1 : position}
            </Table.Cell>
            <Table.Cell>
              <TrackAlbum
                imageUrl={images.medium.secureUrl}
                imageSize='tiny'
                iconSize='big'
                track={track}
              />
            </Table.Cell>
            <Table.Cell>{constructTrackLink(track)}</Table.Cell>
            <Table.Cell>{constructLinks(artists, 'artist')}</Table.Cell>
            <Table.Cell><Link to={`/label/${label.slug}/${label.id}`}>{label.name}</Link></Table.Cell>
            <Table.Cell>{constructLinks(genres, 'genre')}</Table.Cell>
            <Table.Cell>{bpm}</Table.Cell>
            <Table.Cell>{musicalKeyFilter(key && key.shortName)}</Table.Cell>
            <Table.Cell>{releaseDate}</Table.Cell>
            {isPlaylist &&
              <Table.Cell>{dateAddedFormatted}</Table.Cell>
            }
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
  }
}


const mapStateToProps = state => {
  return {
    downloadedTracks: state.downloadedTracks,
  }
}

export default withRouter(connect(mapStateToProps, {})(TrackListingTableBody));
