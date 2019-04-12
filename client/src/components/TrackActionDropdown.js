import React from 'react';
import { Dropdown } from 'semantic-ui-react';

import AddToPlaylist from './AddToPlaylist';
import DownloadTrack from './DownloadTrack';
import SimilarTrack from './SimilarTrack';
import LoveItem from './LoveItem';

const TrackActionDropdown = ({ track, ellipsisOrientation = 'vertical', upward = false }) => {
  return (
    <Dropdown icon={`ellipsis ${ellipsisOrientation}`} floating upward={upward}>
      <Dropdown.Menu className='trackActionDropdown'>
        <DownloadTrack type='dropdownItem' track={track} />
        <SimilarTrack type='dropdownItem' track={track} />
        <AddToPlaylist type='dropdownItem' track={track} />
        <LoveItem type='dropdownItem' itemType='track' item={track} />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default TrackActionDropdown;
