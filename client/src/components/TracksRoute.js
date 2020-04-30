import React, { useEffect } from 'react';
import queryString from 'query-string';
import Scroll from 'react-scroll';

import TracksController from './TracksController';

const TracksRoute = ({ match, location }) => {
  useEffect(() => {
    Scroll.animateScroll.scrollToTop({ duration: 500 });
  }, []);

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

  return <TracksController filterBar trackQuery={trackQuery} />;
};

export default TracksRoute;
