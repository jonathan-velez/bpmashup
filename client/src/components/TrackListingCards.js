import React from 'react';
import _ from 'lodash';
import { Card, Message, Header } from 'semantic-ui-react';
import TrackCard from './TrackCard';

const noTracksMessage =
  <Message warning>
    <Header size='huge'>Hey!</Header>
    <p>Nothing to display.</p>
  </Message>

const TrackListingCards = ({ trackListing, isLoading, itemsPerRow = 3, showPosition = true }) => {
  if (isLoading || !trackListing) {
    return noTracksMessage;
  }

  let orderedTracks = [];

  // if tracklisting is an object from redux, sort by position and convert to array
  if (!Array.isArray(trackListing) && Object.keys(trackListing).length > 0) {
    orderedTracks = _.sortBy(trackListing, 'position');
  }

  // if tracklisting is already an array, assign it
  if (Array.isArray(trackListing)) {
    orderedTracks = trackListing;
  }

  if (orderedTracks.length === 0) {
    return noTracksMessage;
  }

  return (
    <Card.Group stackable itemsPerRow={itemsPerRow} className='trackListingCardGroup'>
      {orderedTracks.length > 0 && orderedTracks.map(track => {
        return (
          <TrackCard track={track} key={track.id} showPosition={showPosition} />
        )
      })}
    </Card.Group>
  )
}

export default TrackListingCards;
