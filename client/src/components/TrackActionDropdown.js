import React, { useState } from 'react';
import { Popup, Menu, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';

import AddToPlaylist from './AddToPlaylist';
import DownloadTrack from './DownloadTrack';
import SimilarTrack from './SimilarTrack';
import LoveItem from './LoveItem';
import BuyTrack from './BuyTrack';
import { hasZippyPermission } from '../selectors';
import { generateBPTrackLink } from '../utils/trackUtils';

const TrackActionDropdown = ({
  track,
  ellipsisOrientation = 'vertical',
  canZip,
}) => {
  const [popupOpen, setPopupOpen] = useState(false);

  const handleClose = () => {
    setPopupOpen(false);
  }

  const handleOpen = () => {
    setPopupOpen(true);
  }

  return (
    <React.Fragment>
      <Popup
        trigger={<Button icon={`ellipsis ${ellipsisOrientation}`} basic circular />}
        on='click'
        style={{ padding: 0 }}
        closeOnDocumentClick={false}
        open={popupOpen}
        onClose={handleClose}
        onOpen={handleOpen}
      >
        <Menu style={{ border: 'none' }} borderless vertical size='small'>
          {canZip ? (
            <DownloadTrack type='dropdownItem' track={track} clickCallback={handleClose} />
          ) : (
            <BuyTrack
              type='dropdownItem'
              purchaseLink={generateBPTrackLink(track)}
            />
          )}
          <SimilarTrack
            type='dropdownItem'
            track={track}
          />
          <AddToPlaylist
            type='dropdownItem'
            track={track}
            clickCallback={handleClose}
          />
          <LoveItem
            type='dropdownItem'
            itemType='track'
            item={track}
            clickCallback={handleClose}
          />
        </Menu>
      </Popup>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    canZip: hasZippyPermission(state),
  };
};

export default connect(
  mapStateToProps,
  null,
)(TrackActionDropdown);
