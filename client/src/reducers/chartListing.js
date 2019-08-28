import { GET_CHART_DATA } from '../constants/actionTypes';

const defaultState = {
  chartOwner: {},
  description: '',
  genres: [],
  id: 0,
  images: {},
  name: '',
  publishDate: '',
  sku: '',
  slug: '',
  tracks: {},
}

const chartListing = (state = defaultState, action) => {
  switch (action.type) {
    case GET_CHART_DATA:
      return action.payload;
    default:
      return state;
  }
}

export default chartListing;
