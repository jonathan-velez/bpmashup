import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';

import AddToPlaylist from './AddToPlaylist';
import DownloadTrack from './DownloadTrack';
import SimilarTrack from './SimilarTrack';
import LoveItem from './LoveItem';
import BuyTrack from './BuyTrack';
import { hasZippyPermission } from '../selectors';
import { generateBPTrackLink } from '../utils/trackUtils';

const TrackActionDropdown = ({ track, ellipsisOrientation = 'vertical', upward = false, canZip }) => {
  return (
    <Dropdown icon={`ellipsis ${ellipsisOrientation}`} floating upward={upward}>
      <Dropdown.Menu className='trackActionDropdown'>
        {canZip ?
          <DownloadTrack type='dropdownItem' track={track} /> :
          <BuyTrack type='dropdownItem' purchaseLink={generateBPTrackLink(track)} />
        }
        <SimilarTrack type='dropdownItem' track={track} />
        <AddToPlaylist type='dropdownItem' track={track} />
        <LoveItem type='dropdownItem' itemType='track' item={track} />
      </Dropdown.Menu>
    </Dropdown>
  );
};

const mapStateToProps = state => {
  return {
    canZip: hasZippyPermission(state),
  }
}

export default connect(mapStateToProps, null)(TrackActionDropdown);
