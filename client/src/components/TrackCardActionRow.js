import React from 'react';

import DownloadTrack from './DownloadTrack';
import LoveItem from './LoveItem';
import AddToPlaylist from './AddToPlaylist';
import BuyTrack from './BuyTrack';
import { generateBPTrackLink } from '../utils/trackUtils';

const TrackCardActionRow = ({ canZip, track, numOfButtons }) => {
  return (
    <div className={`ui ${numOfButtons} buttons`}>
      {canZip ?
        <DownloadTrack track={track} /> :
        <BuyTrack type='button' purchaseLink={generateBPTrackLink(track)} />
      }
      <LoveItem itemType='track' item={track} type='button' />
      <AddToPlaylist track={track} />
    </div>
  );
};

export default TrackCardActionRow;
