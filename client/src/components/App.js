import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import _ from 'lodash';
import ReactPlayer from 'react-player';
import { Dimmer, Loader } from 'semantic-ui-react';

import { downloadTrack } from '../utils/trackUtils';
import * as actionCreators from '../actions/ActionCreators';
import { getYoutubeLink } from '../thunks';
import { getNextTrack } from '../utils/trackUtils';
import Navigation from './Navigation';
import Main from './Main';
import Footer from './Footer';
import ModalView from './ModalView';
import ConfirmController from './ConfirmController';

class App extends React.Component {
  componentWillMount() {
    window.addEventListener('keydown', _.throttle((e) => {
      if (e.target.type === 'text') return;

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
        case 'd':
          if (loadedTrack.id) downloadTrack(loadedTrack);
          break;
        case 'f':
          if (!loadedTrack.title || !loadedTrack.artists) return;
          this.props.getYoutubeLink(`${loadedTrack.artists[0].name} ${loadedTrack.title}`);
          break;
        case 'm':
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

  render() {
    const { openModal, mediaPlayer, openModalWindow, play, pause, updateTrackProgress, setDuration, isLoading } = this.props;
    const { loadedUrl, playing, volume, muted, loop, playbackRate } = mediaPlayer;
    return (
      <Router>
        <React.Fragment>
          <Dimmer active={isLoading} page>
            <Loader content='Loading' />
          </Dimmer>
          <ModalView
            open={openModal.open}
            modalContent={openModal.body}
            modalHeader={openModal.title}
            headerIcon={openModal.headerIcon}
            handleClose={() => openModalWindow(false)}
          />
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
            onPlay={play}
            onPause={pause}
            onEnded={this.loadNextTrack}
            onProgress={updateTrackProgress}
            onDuration={setDuration}
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
    isLoading: state.isLoading,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({}, { getYoutubeLink }, actionCreators), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
