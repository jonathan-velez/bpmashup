import React from 'react';
import queryString from 'query-string';

import TracksController from './TracksController';

const TracksRoute = ({ match, location }) => {
  const { search } = location;
  const query = queryString.parse(search);
  const { params } = match;

  const getParsedParams = (params) => {
    const { itemType, itemId } = params;
    const extraParams = {};

    switch (itemType) {
      case 'artist':
        extraParams.artistId = itemId;
        break;
      case 'label':
        extraParams.labelId = itemId;
        break;
      default:
        break;
    }
    return extraParams;
  };

  const trackQuery = {
    ...getParsedParams(params),
    ...query,
  };

  return <TracksController trackQuery={trackQuery} search={search} />;
};

export default TracksRoute;
