import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { scroller } from 'react-scroll';
import { Menu, Image, Responsive, Card, Popup } from 'semantic-ui-react';
import _ from 'lodash';

import { seekChange, seekMouseUp, seekMouseDown, playPause, setVolume, loadTrack } from '../actions/ActionCreators';
import { getYoutubeLink } from '../thunks';
import { constructLinks, getNextTrack, constructTrackLink } from '../utils/trackUtils';
import PrevNextTrack from './PrevNextTrack';
import PlayPauseButton from './PlayPauseButton';
import Duration from './Duration';
import SeekBar from './SeekBar';
import MutePlayer from './MutePlayer';
import VolumeBar from './VolumeBar';
import YouTubeButton from './YouTubeButton';
import TrackActionDropdown from './TrackActionDropdown';

class Footer extends React.PureComponent {
  render() {
    const { seekChange, seekMouseUp, seekMouseDown, playPause, setVolume, getYoutubeLink, mediaPlayer, playerRef, loadTrack } = this.props;

    // TODO: Refactor these functions into a module
    const scrollToTrack = (trackId) => {
      scroller.scrollTo(`track-${trackId}`, {
        duration: 750,
        delay: 50,
        smooth: true,
        offset: -85,
      });
    }

    const handleSeekChange = e => {
      seekChange(+e.target.value);
    }

    const handleSeekMouseUp = e => {
      playerRef.current.seekTo(+e.target.value)
      seekMouseUp();
    }

    const loadNextTrack = (incrementBy = 1) => {
      loadTrack(getNextTrack(incrementBy));
    }

    const getYouTube = loadedTrack => {
      if (loadedTrack.id) {
        getYoutubeLink(`${loadedTrack.artists[0].name} ${loadedTrack.title}`);
      }
    }

    const { playing, played, duration, loadedTrack } = mediaPlayer;
    const youTubeUrl = _.get(mediaPlayer, 'youTubeObject.youTubeUrl');

    if (_.isEmpty(loadedTrack)) {
      return null;
    }

    const trackImage = <Image
      src={loadedTrack.images && loadedTrack.images.large.secureUrl}
      circular
      size='mini'
      onClick={() => scrollToTrack(loadedTrack.id)}
      className={`vinyl${playing ? ' vinyl-animate' : ''}`}
    />

    return (
      <Menu fixed='bottom' className='footer-menu' borderless size='tiny' compact>
        <Responsive minWidth={960} as={Menu.Item}>
          <Card>
            <Card.Content textAlign='left'>
              <Card.Header>{constructTrackLink(loadedTrack)}</Card.Header>
              <Card.Meta>{constructLinks(loadedTrack.artists, 'artist')}</Card.Meta>
            </Card.Content>
          </Card>
        </Responsive>
        <Menu.Item>
          <TrackActionDropdown
            ellipsisOrientation='horizontal'
            upward
            track={loadedTrack}
          />
        </Menu.Item>
        <Menu.Item>
          <Popup size='tiny' trigger={trackImage} content={`${loadedTrack.artists.map(artist => artist.name).join(', ')} - ${loadedTrack.title}`} />
        </Menu.Item>
        <Menu.Item>
          <YouTubeButton getYouTube={getYouTube} loadedTrack={loadedTrack} isLoaded={youTubeUrl ? true : false} />
        </Menu.Item>
        <Menu.Item>
          <Duration seconds={duration * played} />
        </Menu.Item>
        <SeekBar
          played={played}
          seekMouseDown={seekMouseDown}
          seekChange={handleSeekChange}
          seekMouseUp={handleSeekMouseUp}
        />
        <Menu.Item>
          <Duration seconds={duration} />
        </Menu.Item>
        <Menu.Item>
          <PrevNextTrack buttonType='prev' handlePrevNextTrack={loadNextTrack} />
        </Menu.Item>
        <Menu.Item>
          <PlayPauseButton isPlaying={playing} playPause={playPause} />
        </Menu.Item>
        <Menu.Item>
          <PrevNextTrack buttonType='next' handlePrevNextTrack={loadNextTrack} />
        </Menu.Item >
        <Responsive minWidth={960} as={Menu.Item}>
          <MutePlayer />
          <VolumeBar volume={mediaPlayer.volume} setVolume={(e) => setVolume(+e.target.value)} />
        </Responsive>
      </Menu>
    );
  }
}

const mapStateToProps = state => {
  return {
    mediaPlayer: state.mediaPlayer,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ seekChange, seekMouseUp, seekMouseDown, playPause, setVolume, loadTrack, getYoutubeLink }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
