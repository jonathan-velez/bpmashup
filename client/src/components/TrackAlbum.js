import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actionCreators from '../actions/ActionCreators';
import { Dimmer, Icon, Image } from 'semantic-ui-react';

class TrackAlbum extends React.Component {
  state = {
    active: false
  }

  handleShow = () => this.setState({ active: true });
  handleHide = () => this.setState({ active: false });

  render() {
    const { imageUrl, loadTrack, imageSize, track, playPause } = this.props;
    const { active } = this.state;

    const isLoaded = this.props.mediaPlayer.loadedTrack.id === track.id;
    const isPlaying = this.props.mediaPlayer.playing;

    return (
      <Dimmer.Dimmable
        dimmed={active}
        onMouseEnter={this.handleShow}
        onMouseLeave={this.handleHide}
        onClick={isLoaded ? () => playPause() : () => loadTrack(track)}
      >
        <Dimmer active={active}>
          <Icon
            link
            name={isPlaying && isLoaded ? 'pause' : 'play'}            
            size='huge'
          />
        </Dimmer>
        <Image src={imageUrl} circular size={imageSize || 'large'} className={isLoaded ? 'flex-card active-track' : 'flex-card'} />
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
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackAlbum);