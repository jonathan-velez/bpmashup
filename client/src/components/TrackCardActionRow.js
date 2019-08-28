import React from 'react';
import DownloadTrack from './DownloadTrack';
import LoveItem from './LoveItem';
import AddToPlaylist from './AddToPlaylist';

const TrackCardActionRow = ({ canZip, track, numOfButtons }) => {
  return (
    <div className={`ui ${numOfButtons} buttons`}>
      {canZip && <DownloadTrack track={track} />}
      <LoveItem itemType='track' item={track} type='button' />
      <AddToPlaylist track={track} />
    </div>
  );
};

export default TrackCardActionRow;
