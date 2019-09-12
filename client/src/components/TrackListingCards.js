import React from 'react';
import _ from 'lodash';
import { Card } from 'semantic-ui-react';

import TrackCard from './TrackCard';
import NothingHereMessage from './NothingHereMessage';

const TrackListingCards = ({ trackListing, isLoading, itemsPerRow = 3, showPosition = true }) => {
  if (isLoading || !trackListing) {
    return <NothingHereMessage />
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
    return <NothingHereMessage />
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
