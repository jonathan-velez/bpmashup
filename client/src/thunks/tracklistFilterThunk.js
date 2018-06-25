import _ from 'lodash';

export const filterTracks = payload => {
  return (dispatch, getState) => {
    let filterTarget = '';

    switch (payload.filterBy) {
      case 'musicalKey':
        filterTarget = 'key.shortName';
        break;
      case 'label':
        filterTarget = 'label.name';
        break;
      default:
        return;
    }
    
    const { tracks } = getState().trackListing;

    const filteredTracks = _.pickBy(tracks, track => {
      return _.get(track, filterTarget) === payload.filterValue;
    });

    // TODO: add filtered type and value to dispatch. e.g. key -> 7A

    dispatch({
      type: 'FILTER_TRACKLIST',
      payload: filteredTracks
    })
  }
}
