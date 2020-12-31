import React, { useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Scroll from 'react-scroll';

import TitleHeader from './TitleHeader';
import NothingHereMessage from './NothingHereMessage';
import ChartItemCard from './ChartItemCard';
import { DEFAULT_PAGE_TITLE } from '../constants/defaults';
import { fetchChartsByIds, clearInfiniteCharts } from '../thunks';
import {
  getLovedChartIds,
  getChartsMetadata,
  getInfiniteCharts,
} from '../selectors';

const NUM_OF_CHARTS_AT_A_TIME = 8;

const MyLovedCharts = ({
  chartsMetadata,
  fetchChartsByIds,
  lovedChartIds = [],
  clearInfiniteCharts,
  infiniteCharts,
}) => {
  useEffect(() => {
    if (lovedChartIds.length > 0) {
      Scroll.animateScroll.scrollToTop({ duration: 500 });
      fetchAndSetChartData(lovedChartIds);
    }

    return () => {
      clearInfiniteCharts();
    };
  }, [fetchAndSetChartData, lovedChartIds, clearInfiniteCharts]);

  const fetchAndSetChartData = useCallback(
    (chartIds) => {
      fetchChartsByIds(chartIds, 1, NUM_OF_CHARTS_AT_A_TIME);
    },
    [fetchChartsByIds],
  );

  const advancePage = () => {
    const { page = 0 } = chartsMetadata;
    const nextPage = page + 1;
    fetchChartsByIds(lovedChartIds, nextPage, NUM_OF_CHARTS_AT_A_TIME);
  };

  if (lovedChartIds.length === 0) {
    return <NothingHereMessage />;
  }

  return (
    <>
      <Helmet>
        <title>My Loved Charts :: {DEFAULT_PAGE_TITLE}</title>
      </Helmet>
      <TitleHeader headerTitle='My Loved Charts' />
      <InfiniteScroll
        dataLength={infiniteCharts.length}
        next={advancePage}
        hasMore={
          infiniteCharts.length <
          ((chartsMetadata && chartsMetadata && chartsMetadata.count) ||
            Number.MAX_SAFE_INTEGER)
        }
        loader={<h4>Loading charts...</h4>}
        scrollThreshold={0.9}
      >
        <Grid columns={4}>
          {infiniteCharts.map((chartItem) => {
            return (
              <Grid.Column key={chartItem.sku}>
                <ChartItemCard chartItem={chartItem} />
              </Grid.Column>
            );
          })}
        </Grid>
      </InfiniteScroll>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    lovedChartIds: getLovedChartIds(state),
    infiniteCharts: getInfiniteCharts(state),
    chartsMetadata: getChartsMetadata(state),
  };
};

export default connect(
  mapStateToProps,
  { fetchChartsByIds, clearInfiniteCharts },
)(MyLovedCharts);
