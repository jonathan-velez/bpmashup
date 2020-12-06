import React from 'react';
import { Helmet } from 'react-helmet';

import BeatportCharts from './BeatportCharts';
import TrackListingController from './TrackListingController';
import { DEFAULT_PAGE_TITLE } from '../constants/defaults';

const Home = (props) => {
  return (
    <>
      <Helmet>
        <title>{DEFAULT_PAGE_TITLE}</title>
      </Helmet>
      <BeatportCharts />
      <TrackListingController {...props} />
    </>
  );
};

export default Home;
