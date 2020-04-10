import React from 'react';
import BeatportCharts from './BeatportCharts';
import TrackListingController from './TrackListingController';

const Home = (props) => {
  return (
    <React.Fragment>
      <BeatportCharts />
      <TrackListingController {...props} />
    </React.Fragment>
  );
};

export default Home;
