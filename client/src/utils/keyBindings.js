import { downloadTrack } from './utils/trackUtils';

export const playerControls = (e) => {
  if (e.target.toString() === '[object HTMLInputElement]') return;

  const { loadedTrack } = this.props.mediaPlayer;
  let nextTrack = {}, prevTrack = {};

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
      // use async / await or something here like before. maybe also combine in one action
      // EDIT: Maybe a thunk would work here. we need to access both playlist and mediaplayer
      if (loadedTrack.id) this.props.loadYoutubeLink(this.props.getYoutubeLink(`${loadedTrack.artists[0].name} ${loadedTrack.title}`));
      break;
    case 'm':
      if (loadedTrack.id) this.props.toggleMute();
      break;
    // case 'ArrowRight':
    //   if (loadedTrack.id) this.fastForwardTrack(true);
    //   break;
    // case 'ArrowLeft':
    //   if (loadedTrack.id) this.fastForwardTrack(false);
    //   break;          
    default:
      break;
  }
}