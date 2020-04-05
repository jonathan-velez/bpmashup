import { createSelector } from 'reselect';

const getUserDownloadQueue = (state) =>
  state.downloadQueue && state.downloadQueue.queue;

export const getUserDownloadQueueTrackIds = createSelector(
  [getUserDownloadQueue],
  (queue) => {
    const keys = Object.keys(queue);
    return keys.map((key) => queue[key].beatportTrackId);
  },
);

// TODO: refactory user activity from firebase realtime db to firestore here