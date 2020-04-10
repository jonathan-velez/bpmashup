import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import TracklistingHeader from './TracklistingHeader';
import ChartSlider from './ChartSlider';
import { fetchBeatportCharts } from '../thunks';

const BeatportCharts = ({ isLoading, fetchBeatportCharts, beatportCharts }) => {
  useEffect(() => {
    fetchBeatportCharts();
  }, [fetchBeatportCharts]);

  if (isLoading) return <div>Loading...</div>;

  const { results = {} } = beatportCharts;
  let { charts = [] } = results;

  return (
    <React.Fragment>
      <TracklistingHeader headerPrefix='TOP' headerTitle='CHARTS' />
      <ChartSlider charts={charts} />
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const { isLoading, beatportCharts } = state;
  return {
    isLoading,
    beatportCharts,
  };
};

const mapDispatchToProps = { fetchBeatportCharts };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BeatportCharts);
