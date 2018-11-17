import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';

import { toggleTracklistView } from '../actions/ActionCreators';

const TrackListingViewToggleButtons = ({ trackListing, toggleTracklistView }) => {
  const { tracklistView } = trackListing;

  return (
    <Button.Group className='tracklistViewToggle'>
      <Button
        active={tracklistView === 'table'}
        onClick={() => toggleTracklistView('table')}
      > <Icon name='list layout' />
      </Button>
      <Button
        active={tracklistView === 'cards'}
        onClick={() => toggleTracklistView('cards')}
      ><Icon name='grid layout' />
      </Button>
    </Button.Group>
  );
};

const mapStateToProps = state => {
  return {
    trackListing: state.trackListing,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ toggleTracklistView }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackListingViewToggleButtons);
