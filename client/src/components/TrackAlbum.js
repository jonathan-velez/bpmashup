import React from 'react';
import { connect } from 'react-redux';

import { playPause } from '../actions/ActionCreators';
import { Dimmer, Icon, Image } from 'semantic-ui-react';
import { loadTrackThunk } from '../thunks';
import { isTrackPlaying, isTrackLoaded } from '../selectors/index';

class TrackAlbum extends React.PureComponent {
  state = {
    active: false,
  };

  handleShow = () => this.setState({ active: true });
  handleHide = () => this.setState({ active: false });

  render() {
    const {
      imageUrl,
      loadTrackThunk,
      imageSize = 'large',
      track,
      playPause,
      iconSize = 'massive',
      isLoaded,
      isPlaying,
    } = this.props;
    const { active } = this.state;

    const handleClick = () => {
      if (isLoaded) {
        playPause();
      } else {
        loadTrackThunk(track);
      }
    };

    return (
      <Dimmer.Dimmable
        dimmed={active}
        onMouseEnter={this.handleShow}
        onMouseLeave={this.handleHide}
        onClick={handleClick}
      >
        <Dimmer active={active}>
          <Icon
            link
            name={isPlaying && isLoaded ? 'pause' : 'play'}
            size={iconSize}
          />
        </Dimmer>
        <Image
          src={imageUrl}
          size={imageSize}
          className={isLoaded ? 'flex-card active-track' : 'flex-card'}
        />
      </Dimmer.Dimmable>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const isLoaded = isTrackLoaded(state, ownProps.track.id);
  const isPlaying = isTrackPlaying(state, ownProps.track.id);

  return {
    isLoaded,
    isPlaying,
  };
};

export default connect(
  mapStateToProps,
  { playPause, loadTrackThunk },
)(TrackAlbum);
