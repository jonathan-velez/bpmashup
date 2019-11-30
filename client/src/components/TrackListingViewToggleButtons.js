import React from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';

import { toggleTracklistView } from '../actions/ActionCreators';
import { getTracklistViewSetting, setTracklistViewSetting } from '../utils/helpers';

const TrackListingViewToggleButtons = ({ toggleTracklistView }) => {
  const handleToggleTracklistView = (view) => {
    toggleTracklistView(view);
    setTracklistViewSetting(view);
  }
  
  return (
    <Button.Group className='tracklistViewToggle'>
      <Button
        active={getTracklistViewSetting() === 'table'}
        onClick={() => handleToggleTracklistView('table')}
      > <Icon name='list layout' />
      </Button>
      <Button
        active={getTracklistViewSetting() === 'cards'}
        onClick={() => handleToggleTracklistView('cards')}
      ><Icon name='grid layout' />
      </Button>
    </Button.Group>
  );
};

const mapDispatchToProps = {
  toggleTracklistView,
}

export default connect(null, mapDispatchToProps)(TrackListingViewToggleButtons);
