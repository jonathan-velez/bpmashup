import axios from 'axios';
import { API_MY_BEATPORT } from '../constants/apiPaths';
import { START_ASYNC, GET_TRACKS, FETCH_TRACKS } from '../constants/actionTypes';
import queryString from 'query-string';
import _ from 'lodash';

export const getTracks = async (searchFacets) => {
  return async (dispatch) => {
    dispatch({
      type: START_ASYNC,
    });

    let facetsString = '';
    const facetsModel = {
      key: null,
      genre: null,
    };

    const facetsParams = !_.isEmpty(searchFacets) && Object.keys(facetsModel).reduce((obj, key) => {
      if (searchFacets[key]) {
        obj[key] = searchFacets[key];
      }
      return obj;
    }, {});

    const pageModel = {
      page: 1,
      perPage: 25,
    }

    const pageParams = queryString.stringify(Object.keys(pageModel).reduce((obj, key) => {
      obj[key] = !searchFacets[key] ? pageModel[key] : searchFacets[key];
      return obj;
    }, {}));

    if (facetsParams) {
      const facets = Object.keys(facetsParams);

      for (let i = 0; i < facets.length; i++) {
        const facetName = facets[i];
        facetsString += (i > 0 ? ',' : '') + facetName + ':' + facetsParams[facetName];
      }
    }

    const tracksRequest = await axios.get(`${API_MY_BEATPORT}?${pageParams}${facetsParams ? `&facets=${facetsString}` : ''}&sortBy=publishDate%20DESC`);

    dispatch({
      type: FETCH_TRACKS,
      payload: tracksRequest,
    });

    dispatch({
      type: GET_TRACKS,
    });
  }
}
