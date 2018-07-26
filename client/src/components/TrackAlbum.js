import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actionCreators from '../actions/ActionCreators';
import { Dimmer, Icon, Image } from 'semantic-ui-react';

import * as thunks from '../thunks';
class TrackAlbum extends React.Component {
  state = {
    active: false
  }

  handleShow = () => this.setState({ active: true });
  handleHide = () => this.setState({ active: false });

  render() {
    const { imageUrl, loadTrackThunk, imageSize = 'large', track, playPause, iconSize = 'massive' } = this.props;
    const { active } = this.state;

    const isLoaded = this.props.mediaPlayer.loadedTrack.id === track.id;
    const isPlaying = this.props.mediaPlayer.playing;

    return (
      <Dimmer.Dimmable
        dimmed={active}
        onMouseEnter={this.handleShow}
        onMouseLeave={this.handleHide}
        // onClick={isLoaded ? () => playPause() : () => loadTrack(track)}
        onClick={isLoaded ? () => playPause() : () => loadTrackThunk(track)}
      >
        <Dimmer active={active}>
          <Icon
            link
            name={isPlaying && isLoaded ? 'pause' : 'play'}            
            size={iconSize}
          />
        </Dimmer>
        <Image src={imageUrl} size={imageSize} className={isLoaded ? 'flex-card active-track' : 'flex-card'} />
      </Dimmer.Dimmable>
    )
  }
}

const mapStateToProps = state => {
  return {
    mediaPlayer: state.mediaPlayer,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({}, actionCreators, thunks), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackAlbum);