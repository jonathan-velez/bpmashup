import _ from 'lodash';

const lovedArtistsDetails = (state = [], action) => {
  
  switch (action.type) {
    case 'LOAD_LOVED_ARTISTS_DETAILS': {
      if (!_.has(action.payload.data, 'metadata') || !_.has(action.payload.data, 'results')) {
        return [];
      }

      const { metadata, results } = action.payload.data;

      // extract id as the key, convert array to object
      const keyedArtists = _.mapKeys(results, 'id');

      return {
        metadata,
        artists: keyedArtists
      }
    }
    default:
      return state;
  }
}

export default lovedArtistsDetails;
