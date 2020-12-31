import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import Scroll from 'react-scroll';
import { Grid } from 'semantic-ui-react';

import TitleHeader from './TitleHeader';
import ChartItemCard from './ChartItemCard';
import { getChartsMetadata, getInfiniteCharts } from '../selectors';
import { fetchChartsByProfileId, clearInfiniteCharts } from '../thunks';
import { deslugify } from '../utils/helpers';

const InfiniteChartsByProfileId = ({
  match,
  infiniteCharts,
  chartsMetadata,
  isLoading,
  fetchChartsByProfileId,
  clearInfiniteCharts,
}) => {
  const { params } = match;
  const { ownerId, ownerName } = params;

  useEffect(() => {
    clearInfiniteCharts();

    if (ownerId) {
      Scroll.animateScroll.scrollToTop({ duration: 500 });
      fetchChartsByProfileId(ownerId);
    }

    return () => clearInfiniteCharts();
  }, [fetchChartsByProfileId, ownerId, clearInfiniteCharts]);

  const advancePage = () => {
    const { page = 0 } = chartsMetadata;
    const nextPage = page + 1;
    fetchChartsByProfileId(ownerId, nextPage);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!ownerId) {
    return <div>No Owner Id provided!</div>;
  }

  return (
    <>
      <TitleHeader
        headerPrefix='LATEST CHARTS'
        headerTitle={deslugify(ownerName)}
      />
      {/* TODO: DRY This up. it was copied from <MyLovedCharts /> */}
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
    infiniteCharts: getInfiniteCharts(state),
    chartsMetadata: getChartsMetadata(state),
  };
};

export default connect(
  mapStateToProps,
  { fetchChartsByProfileId, clearInfiniteCharts },
)(InfiniteChartsByProfileId);
