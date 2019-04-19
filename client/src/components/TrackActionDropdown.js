import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';

import AddToPlaylist from './AddToPlaylist';
import DownloadTrack from './DownloadTrack';
import SimilarTrack from './SimilarTrack';
import LoveItem from './LoveItem';

const TrackActionDropdown = ({ track, ellipsisOrientation = 'vertical', upward = false, userDetail }) => {
  const { permissions } = userDetail;
  const canZip = Array.isArray(permissions) && permissions.includes('zipZip');

  return (
    <Dropdown icon={`ellipsis ${ellipsisOrientation}`} floating upward={upward}>
      <Dropdown.Menu className='trackActionDropdown'>
        {canZip && <DownloadTrack type='dropdownItem' track={track} />}
        <SimilarTrack type='dropdownItem' track={track} />
        <AddToPlaylist type='dropdownItem' track={track} />
        <LoveItem type='dropdownItem' itemType='track' item={track} />
      </Dropdown.Menu>
    </Dropdown>
  );
};

const mapStateToProps = state => {
  return {
    userDetail: state.userDetail,
  }
}

export default connect(mapStateToProps, null)(TrackActionDropdown);
