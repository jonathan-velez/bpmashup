import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import _ from 'lodash';
import ReactPlayer from 'react-player';

import { downloadTrack } from '../utils/trackUtils';
import * as actionCreators from '../actions/ActionCreators';
import { getNextTrack } from '../utils/trackUtils';

import Navigation from './Navigation';
import Main from './Main';
import Footer from './Footer';
import ModalView from './ModalView';
import ConfirmController from './ConfirmController';

class App extends React.Component {
  componentWillMount() {
    window.addEventListener('keydown', _.throttle((e) => {
      if (e.target.toString() === '[object HTMLInputElement]') return;

      const { loadedTrack } = this.props.mediaPlayer;

      switch (e.key) {
        case 'p':
          this.props.playPause();
          break;
        case 'n':
          if (loadedTrack.id) this.loadNextTrack(1);
          break;
        case 'b':
          if (loadedTrack.id) this.loadNextTrack(-1);
          break;
        // case 'c':
        //   if (loadedTrack.id) this.addTrackToCrate(loadedTrack.id, true);
        //   break;
        case 'd':
          if (loadedTrack.id) downloadTrack(loadedTrack);
          break;
        case 'f':
          // get and load youtube link
          this.props.startAsync();
          this.props.getYoutubeLink(`${loadedTrack.artists[0].name} ${loadedTrack.title}`);
          break;
        case 'm':
          if (loadedTrack.id) this.props.toggleMute();
          break;
        case 'ArrowRight':
          // fast forward 5 seconds
          if (loadedTrack.id) {
            this.fastForward(5);
          }
          break;
        case 'ArrowLeft':
          // rewind 5 seconds
          if (loadedTrack.id) {
            this.fastForward(-5);
          }
          break;
        case '=':
          // Turn it up!
          if (loadedTrack.id) {
            this.changeVolume(.15);
          }
          break;
        case '-':
          // Turn it down!
          if (loadedTrack.id) {
            this.changeVolume(-.15);
          }
          break;
        default:
          break;
      }

    }, 200), null);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown');
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

  render() {
    const { loadedUrl, playing, volume, muted, loop, playbackRate } = this.props.mediaPlayer;
    return (
      <Router>
        <React.Fragment>
          <ModalView open={this.props.openModal.open} modalContent='soomemoe' modalHeader='xxxx' />
          <ConfirmController />
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
            // onReady={() => console.log('onReady')}
            onStart={() => console.log('onStart')}
            onPlay={this.props.play}
            onPause={this.props.pause}
            onBuffer={() => console.log('onBuffer')}
            // onSeek={e => console.log('onSeek', e)}
            onEnded={this.loadNextTrack}
            onError={e => console.log('onError', e)}
            onProgress={this.props.updateTrackProgress}
            onDuration={this.props.setDuration}
          />
          <Navigation />
          <Main />
          <Footer playerRef={this.player} />
        </React.Fragment>
      </Router>
    )
  }
}
const mapStateToProps = state => {
  return {
    playlistList: state.playlistList,
    trackListing: state.trackListing,
    mediaPlayer: state.mediaPlayer,
    openModal: state.openModal,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
