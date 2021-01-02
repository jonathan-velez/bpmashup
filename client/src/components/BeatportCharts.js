import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

import TitleHeader from './TitleHeader';
import ChartSlider from './ChartSlider';
import { fetchChartsByProfileId, clearInfiniteCharts } from '../thunks';
import { DEFAULT_BEATPORT_PROFILE_ID } from '../constants/defaults';

// TODO: Generalize this component as a Slider for charts by owner ID
const BeatportCharts = ({
  isLoading,
  fetchChartsByProfileId,
  chartsList,
  clearInfiniteCharts,
}) => {
  useEffect(() => {
    clearInfiniteCharts();
    fetchChartsByProfileId(DEFAULT_BEATPORT_PROFILE_ID);

    return () => clearInfiniteCharts();
  }, [fetchChartsByProfileId, clearInfiniteCharts]);

  if (isLoading) return <div>Loading...</div>;

  const { results = {} } = chartsList;
  let { charts = [] } = results;

  return (
    <React.Fragment>
      <TitleHeader headerPrefix='TOP CHARTS' headerTitle='ALL GENRES' />
      <ChartSlider charts={charts} />
      <Button
        basic
        as={Link}
        to={`charts/beatport/${DEFAULT_BEATPORT_PROFILE_ID}`}
        style={{ float: 'right', marginTop: '12px' }}
      >
        Beatport's Charts
      </Button>
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

const mapDispatchToProps = { fetchChartsByProfileId, clearInfiniteCharts };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BeatportCharts);
