import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { scroller } from 'react-scroll';
import { Menu, Image, Container, Card } from 'semantic-ui-react';

import * as actionCreators from '../actions/ActionCreators';
import { constructLinks, getNextTrack } from '../utils/trackUtils';
import PrevNextTrack from './PrevNextTrack';
import PlayPauseButton from './PlayPauseButton';
import Duration from './Duration';
import SeekBar from './SeekBar';
import MutePlayer from './MutePlayer';
import VolumeBar from './VolumeBar';
import YouTubeButton from './YouTubeButton';

class Footer extends Component {

  // TODO: Refactor these functions into a module
  scrollToTrack = (trackId) => {
    console.log('scrolling to', trackId)
    scroller.scrollTo(`track-${trackId}`, {
      duration: 750,
      delay: 50,
      smooth: true,
      offset: -65,
    });
  }

  seekChange = e => {
    this.props.seekChange(parseFloat(e.target.value));
  }

  seekMouseUp = e => {
    this.props.playerRef.seekTo(parseFloat(e.target.value))
    this.props.seekMouseUp();
  }

  loadNextTrack = (incrementBy = 1) => {
    this.props.loadTrack(getNextTrack(incrementBy));
  }

  getYouTube = loadedTrack => {
    if (loadedTrack) {
      this.props.startAsync();
      this.props.getYoutubeLink(`${loadedTrack.artists[0].name} ${loadedTrack.title}`);
    }
  }

  render() {
    const { playing, played, duration, loadedTrack, youTubeObject } = this.props.mediaPlayer;

    const { youTubeUrl } = youTubeObject;

    return (
      <Menu fixed='bottom' className='footer-menu' borderless>
        <Container textAlign='center'>
          <Menu.Item>
            <Card>
              <Card.Content>
                <Card.Header>{loadedTrack.title}</Card.Header>
                <Card.Meta>{constructLinks(loadedTrack.artists, 'artist')}</Card.Meta>
              </Card.Content>
            </Card>
          </Menu.Item>
          <Menu.Item>
            <Image
              src={loadedTrack.images && loadedTrack.images.large.secureUrl}
              circular
              size='tiny'
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
            seekMouseDown={this.props.seekMouseDown}
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
            <PlayPauseButton isPlaying={playing} playPause={this.props.playPause} />
          </Menu.Item>
          <Menu.Item>
            <PrevNextTrack buttonType='next' handlePrevNextTrack={this.loadNextTrack} />
          </Menu.Item >
          <Menu.Item>
            <MutePlayer />
            <VolumeBar volume={this.props.mediaPlayer.volume} setVolume={(e) => this.props.setVolume(parseFloat(e.target.value))} />
          </Menu.Item>
        </Container>
      </Menu>
    );
  }
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
