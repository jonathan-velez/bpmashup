import produce from 'immer';
import { UPDATE_ADMIN_DOWNLOAD_QUEUE_ACTIVITY_DATA } from '../constants/actionTypes';

const defaultState = {
  downloadQueueItemsArray: [],
};

const globalDownloadActivity = produce((draft, action) => {
  const { type, payload = {} } = action;
  switch (type) {
    case UPDATE_ADMIN_DOWNLOAD_QUEUE_ACTIVITY_DATA: {
      draft.downloadQueueItemsArray = payload.downloadQueueItemsArray || [];
    }
  }
}, defaultState);

export default globalDownloadActivity;
