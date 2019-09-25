import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import App from './App';
import {
  play,
  pause,
  updateTrackProgress,
  setDuration,
  playPause,
  loadTrack,
  seekChange,
  seekMouseUp,
  toggleMute,
  setVolume
} from '../actions/ActionCreators';
import { downloadTrack, getNextTrack } from '../utils/trackUtils';
import { getYoutubeLink } from '../thunks';

class AppWrapper extends Component {
  componentDidMount() {
    window.addEventListener('keydown', _.throttle((e) => {
      if (e.target.type === 'text') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const { loadedTrack } = this.props.mediaPlayer;

      switch (e.key) {
        case 'p':
        case 'P':
          this.props.playPause();
          break;
        case 'n':
        case 'N':
          if (loadedTrack.id) this.loadNextTrack(1);
          break;
        case 'b':
        case 'B':
          if (loadedTrack.id) this.loadNextTrack(-1);
          break;
        case 'd':
        case 'D':
          if (loadedTrack.id) downloadTrack(loadedTrack);
          break;
        case 'f':
        case 'F':
          if (!loadedTrack.title || !loadedTrack.artists) return;
          this.props.getYoutubeLink(`${loadedTrack.artists[0].name} ${loadedTrack.title}`);
          break;
        case 'm':
        case 'M':
          if (loadedTrack.id) this.props.toggleMute();
          break;
        case 'ArrowRight':
          if (loadedTrack.id) {
            this.fastForward(5);
          }
          break;
        case 'ArrowLeft':
          if (loadedTrack.id) {
            this.fastForward(-5);
          }
          break;
        case '=':
          if (loadedTrack.id) {
            this.changeVolume(.15);
          }
          break;
        case '-':
          if (loadedTrack.id) {
            this.changeVolume(-.15);
          }
          break;
        case 'Shift':
        case 'Control':
        case 'Alt':
        case 'Meta':
        default:
          break;
      }

    }, 200), null);
  }

  ref = player => {
    this.player = player;
  }

  fastForward = seconds => {
    if (typeof seconds !== 'number') return;

    const { duration, played } = this.props.mediaPlayer;
    let seekToPosition = (seconds / duration) + played;

    if (seekToPosition > 1) {
      seekToPosition = .99;
    }

    if (seekToPosition < 0) {
      seekToPosition = 0;
    }

    this.player.seekTo(seekToPosition);
    this.props.seekChange(seekToPosition);
    this.props.seekMouseUp();
  }

  changeVolume = amount => {
    if (typeof amount !== 'number') return;

    const { mediaPlayer, setVolume } = this.props;
    let setVolumeTo = mediaPlayer.volume + amount;

    if (setVolumeTo > 1) {
      setVolumeTo = 1;
    }

    if (setVolumeTo < 0) {
      setVolumeTo = 0;
    }

    setVolume(setVolumeTo);
  }

  loadNextTrack = (incrementBy = 1) => {
    this.props.loadTrack(getNextTrack(incrementBy));
  }

  ref = player => {
    this.player = player;
  }

  render() {
    const { mediaPlayer, play, pause, updateTrackProgress, setDuration } = this.props;
    const { loadedUrl, playing, volume, muted, loop, playbackRate } = mediaPlayer;

    return (
      <React.Fragment>
        <App player={this.player} />
        <ReactPlayer
          ref={this.ref}
          className='react-player'
          width={0}
          height={0}
          url={loadedUrl}
          playing={playing}
          loop={loop}
          playbackRate={playbackRate}
          volume={volume}
          muted={muted}
          onPlay={play}
          onPause={pause}
          onEnded={this.loadNextTrack}
          onProgress={updateTrackProgress}
          onDuration={setDuration}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    mediaPlayer: state.mediaPlayer,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    play,
    pause,
    updateTrackProgress,
    setDuration,
    playPause,
    loadTrack,
    getYoutubeLink,
    seekChange,
    seekMouseUp,
    toggleMute,
    setVolume
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AppWrapper);
