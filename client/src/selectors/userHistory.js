import { createSelector } from 'reselect';

const _getPageSetup = (state, props) => {
  const { match = {} } = props;
  const { pageType } = match.params;
  const { downloadedTracks = [], noDownloadList = [], lovedTracks = [] } = state;

  const pageSetup = {
    'downloads': {
      headerTitle: 'Downloads',
      trackIds: downloadedTracks,
    },
    'no-downloads': {
      headerTitle: 'No Downloads Found',
      trackIds: noDownloadList,
    },
    'loved-tracks': {
      headerTitle: 'Loved Tracks',
      trackIds: lovedTracks,
    },
  }

  const { trackIds = [], headerTitle = '' } = pageSetup[pageType] || {};

  return {
    trackIds,
    headerTitle,
  }
}

export const getUserHistoryPageSetup = createSelector([_getPageSetup], pageSetup => pageSetup);
