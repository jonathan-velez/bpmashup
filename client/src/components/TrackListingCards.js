import React from 'react';
import _ from 'lodash';
import { Card, Message, Header } from 'semantic-ui-react';
import TrackCard from './TrackCard';

const TrackListingCards = ({ trackListing, isLoading }) => {
  if (isLoading) return null;

  let trackListingCards = '';
  
  if (trackListing && Object.keys(trackListing).length > 0) {
    const orderedTracks = _.sortBy(trackListing, 'position');
    trackListingCards = orderedTracks.map(track => {
      return (
        <TrackCard track={track} key={track.id} />
      )
    });
  } else {
    return (
      <Message warning>
        <Header size='huge'>Hey!</Header>
        <p>Nothing to display.</p>
      </Message>
    )
  }

  return (
    <Card.Group stackable itemsPerRow={4} className='trackListingCardGroup'>
      {trackListingCards}
    </Card.Group>
  )
}

export default TrackListingCards;
