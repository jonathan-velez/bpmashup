import React from 'react';
import _ from 'lodash';
import { Card, Dimmer, Loader, Message, Header } from 'semantic-ui-react';
import Track from './Track';

const TrackListingCards = props => {
  const { trackListing, isLoading } = props;

  if (isLoading) {
    return (
      <Dimmer active>
        <Loader content='Loading' />
      </Dimmer>
    )
  }

  if (trackListing && Object.keys(trackListing).length > 0) {
    // sort the tracklisting then map the array => tracks
    // TODO: May not be the best place to do this. Research further.
    const orderedTracks = _.orderBy(trackListing, 'position', 'asc');
    this.trackListing = orderedTracks.map(track => {
      return (
        <Track track={track} key={track.id} />
      )
    });
  }else {
    return (
      <Message warning>
        <Header size='huge'>Hey!</Header>
        <p>Nothing to display.</p>
      </Message>
    )
  }

  return (
    <Card.Group stackable itemsPerRow={4}>
      {this.trackListing}
    </Card.Group>
  )
}

export default TrackListingCards;
