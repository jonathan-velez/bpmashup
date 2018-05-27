import firebase from 'firebase';
import { v4 } from 'node-uuid';
import moment from 'moment';

export const activityLogger = store => next => action => {
  const id = v4();
  const state = store.getState();

  let userId = 0;
  const { auth } = state.firebaseState;

  if (auth.isLoaded && !auth.isEmpty) {
    userId = auth.uid
  }

  switch (action.type) {
    case 'LOAD_TRACK':
      firebase.set(`/trackPlays/${id}`, {
        id,
        userId,
        track: action.payload,
        timeStamp: moment().format(),
      });
      break;
    case 'GET_YOUTUBE_LINK':
      firebase.set(`/trackPlaysYouTube/${id}`, {
        id,
        userId,
        track:  state.mediaPlayer.loadedTrack,
        youTubeId: action.payload.data[0].id.videoId,
        timeStamp: moment().format(),
      });
      console.log('GET_YOUTUBE_LINK', state, action)
      break;
    default:
      break;
  }

  // const pushed = firebase.push('/test', track);
  // console.log('pushed', pushed.key);

  next(action);
}
