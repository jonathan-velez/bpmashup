import React, { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import _ from 'lodash';

import App from './App';
import ActionMessage from './ActionMessage';
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

const AppWrapper = ({ mediaPlayer, loadTrack, play, pause, updateTrackProgress, setDuration, playPause, getYoutubeLink, toggleMute, seekChange, seekMouseUp, setVolume }) => {
  const { loadedTrack, loadedUrl, playing, volume, muted, loop, playbackRate, played, duration } = mediaPlayer;
  const playerRef = useRef(null);

  const throttledKeyPressFunctions = _.throttle((e) => {
    if (['text', 'email', 'password'].includes(e.target.type)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    switch (e.key) {
      case 'p':
      case 'P':
        playPause();
        break;
      case 'n':
      case 'N':
        if (loadedTrack.id) loadNextTrack(1);
        break;
      case 'b':
      case 'B':
        if (loadedTrack.id) loadNextTrack(-1);
        break;
      case 'd':
      case 'D':
        if (loadedTrack.id) downloadTrack(loadedTrack);
        break;
      case 'f':
      case 'F':
        // TODO: clean this shit up
        if (!loadedTrack.title || !loadedTrack.artists) return;
        getYoutubeLink(`${loadedTrack.artists[0].name} ${loadedTrack.title}`);
        break;
      case 'm':
      case 'M':
        if (loadedTrack.id) toggleMute();
        break;
      case 'ArrowRight':
        if (loadedTrack.id) {
          fastForward(5);
        }
        break;
      case 'ArrowLeft':
        if (loadedTrack.id) {
          fastForward(-5);
        }
        break;
      case '=':
        if (loadedTrack.id) {
          changeVolume(.15);
        }
        break;
      case '-':
        if (loadedTrack.id) {
          changeVolume(-.15);
        }
        break;
      case 'Shift':
      case 'Control':
      case 'Alt':
      case 'Meta':
      default:
        break;
    }
  }, 200);

  useEffect(() => {
    window.addEventListener('keydown', throttledKeyPressFunctions, null);
    return (() => {
      window.removeEventListener('keydown', throttledKeyPressFunctions, null);
    });
  }, [volume, loadedTrack, played, throttledKeyPressFunctions]);

  const fastForward = (seconds) => {
    if (typeof seconds !== 'number') return;

    let seekToPosition = (seconds / duration) + played;

    if (seekToPosition > 1) {
      seekToPosition = .99;
    }

    if (seekToPosition < 0) {
      seekToPosition = 0;
    }

    playerRef.current.seekTo(seekToPosition);
    seekChange(seekToPosition);
    seekMouseUp();
  }

  const changeVolume = (amount) => {
    if (typeof amount !== 'number') return;
    let setVolumeTo = mediaPlayer.volume + amount;

    if (setVolumeTo > 1) {
      setVolumeTo = 1;
    }

    if (setVolumeTo < 0) {
      setVolumeTo = 0;
    }

    setVolume(setVolumeTo);
  }

  const loadNextTrack = (incrementBy = 1) => {
    loadTrack(getNextTrack(incrementBy));
  }

  return (
    <React.Fragment>
      <App player={playerRef} changeVolume={changeVolume} />
      <ReactPlayer
        ref={playerRef}
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
        onEnded={loadNextTrack}
        onProgress={updateTrackProgress}
        onDuration={setDuration}
      />
      <ActionMessage />
    </React.Fragment>
  );
}

const mapStateToProps = state => {
  return {
    mediaPlayer: state.mediaPlayer,
  }
}

const mapDispatchToProps = {
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
}

export default connect(mapStateToProps, mapDispatchToProps)(AppWrapper);
