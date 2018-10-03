import _ from 'lodash';

const lovedLabelsDetails = (state =[], action) => {
  switch(action.type){
    case 'LOAD_LOVED_LABELS_DETAILS':
      if (!_.has(action.payload.data, 'metadata') || !_.has(action.payload.data, 'results')) {
        return [];
      }

      const { metadata, results } = action.payload.data;

      // extract id as the key, convert array to object
      const keyedLabels = _.mapKeys(results, 'id');

      return {
        metadata,
        labels: keyedLabels
      }
    default:
      return state;
  }
}

export default lovedLabelsDetails;