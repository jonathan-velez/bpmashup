import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import TracklistingHeader from './TracklistingHeader';
import ChartSlider from './ChartSlider';
import { fetchChartsByProfileId } from '../thunks';

const BeatportCharts = ({
  isLoading,
  fetchChartsByProfileId,
  chartsList,
}) => {
  useEffect(() => {
    fetchChartsByProfileId('36047');
  }, [fetchChartsByProfileId]);

  if (isLoading) return <div>Loading...</div>;

  const { results = {} } = chartsList;
  let { charts = [] } = results;

  return (
    <React.Fragment>
      <TracklistingHeader headerPrefix='TOP' headerTitle='CHARTS' />
      <ChartSlider charts={charts} />
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const { isLoading, chartsList } = state;
  return {
    isLoading,
    chartsList,
  };
};

const mapDispatchToProps = { fetchChartsByProfileId };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BeatportCharts);
