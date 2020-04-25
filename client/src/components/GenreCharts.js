import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import TitleHeader from './TitleHeader';
import ChartSlider from './ChartSlider';
import { fetchChartsByGenreId } from '../thunks';

const GenreCharts = ({
  isLoading,
  fetchChartsByGenreId,
  chartsList,
  genreId,
  genreName,
}) => {
  useEffect(() => {
    fetchChartsByGenreId(genreId);
  }, [fetchChartsByGenreId, genreId]);

  if (isLoading) return <div>Loading...</div>;

  const { results = {} } = chartsList;
  let { charts = [] } = results;

  return (
    <React.Fragment>
      <TitleHeader headerPrefix='CHARTS' headerTitle={genreName} />
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

const mapDispatchToProps = { fetchChartsByGenreId };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GenreCharts);
