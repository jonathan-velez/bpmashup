import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { scroller } from 'react-scroll';
import { Menu, Image, Container, Card } from 'semantic-ui-react';
import _ from 'lodash';

import * as actionCreators from '../actions/ActionCreators';
import { constructLinks, getNextTrack } from '../utils/trackUtils';
import PrevNextTrack from './PrevNextTrack';
import PlayPauseButton from './PlayPauseButton';
import Duration from './Duration';
import SeekBar from './SeekBar';
import MutePlayer from './MutePlayer';
import VolumeBar from './VolumeBar';
import YouTubeButton from './YouTubeButton';
import TrackActionDropdown from './TrackActionDropdown';

const Footer = ({ seekChange, seekMouseUp, seekMouseDown, playPause, setVolume, startAsync, getYoutubeLink, mediaPlayer, playerRef, loadTrack }) => {

  // TODO: Refactor these functions into a module
  this.scrollToTrack = (trackId) => {
    scroller.scrollTo(`track-${trackId}`, {
      duration: 750,
      delay: 50,
      smooth: true,
      offset: -65,
    });
  }

  this.seekChange = e => {
    seekChange(+e.target.value);
  }

  this.seekMouseUp = e => {
    playerRef.seekTo(+e.target.value)
    seekMouseUp();
  }

  this.loadNextTrack = (incrementBy = 1) => {
    loadTrack(getNextTrack(incrementBy));
  }

  this.getYouTube = loadedTrack => {
    if (loadedTrack.id) {
      startAsync();
      getYoutubeLink(`${loadedTrack.artists[0].name} ${loadedTrack.title}`);
    }
  }

  const { playing, played, duration, loadedTrack } = mediaPlayer;
  const youTubeUrl = _.get(this.props, 'mediaPlayer.youTubeObject.youTubeUrl');

  if (_.isEmpty(loadedTrack)) {
    return null;
  }

  console.log(loadedTrack)

  return (
    <Menu fixed='bottom' className='footer-menu' borderless size='tiny' compact>
      <Container textAlign='center'>
        <Menu.Item>
          <Card>
            <Card.Content textAlign='left'>
              <Card.Header>{loadedTrack.title}</Card.Header>
              <Card.Meta>{constructLinks(loadedTrack.artists, 'artist')}</Card.Meta>
            </Card.Content>
          </Card>
        </Menu.Item>
        <Menu.Item>
          <TrackActionDropdown
            ellipsisOrientation='horizontal'
            upward
            track={loadedTrack}
          />
        </Menu.Item>
        <Menu.Item>
          <Image
            src={loadedTrack.images && loadedTrack.images.large.secureUrl}
            circular
            size='mini'
            onClick={() => this.scrollToTrack(loadedTrack.id)}
            className={`vinyl${playing ? ' vinyl-animate' : ''}`}
          />
        </Menu.Item>
        <Menu.Item>
          <YouTubeButton getYouTube={this.getYouTube} loadedTrack={loadedTrack} isLoaded={youTubeUrl ? true : false} />
        </Menu.Item>
        <Menu.Item>
          <Duration seconds={duration * played} />
        </Menu.Item>
        <SeekBar
          played={played}
          seekMouseDown={seekMouseDown}
          seekChange={this.seekChange}
          seekMouseUp={this.seekMouseUp}
        />
        <Menu.Item>
          <Duration seconds={duration} />
        </Menu.Item>
        <Menu.Item>
          <PrevNextTrack buttonType='prev' handlePrevNextTrack={this.loadNextTrack} />
        </Menu.Item>
        <Menu.Item>
          <PlayPauseButton isPlaying={playing} playPause={playPause} />
        </Menu.Item>
        <Menu.Item>
          <PrevNextTrack buttonType='next' handlePrevNextTrack={this.loadNextTrack} />
        </Menu.Item >
        <Menu.Item>
          <MutePlayer />
          <VolumeBar volume={mediaPlayer.volume} setVolume={(e) => setVolume(+e.target.value)} />
        </Menu.Item>
      </Container>
    </Menu>
  );
}

const mapStateToProps = state => {
  return {
    trackListing: state.trackListing,
    mediaPlayer: state.mediaPlayer,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
