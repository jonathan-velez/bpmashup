import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import queryString from 'query-string';
import InfiniteScroll from 'react-infinite-scroll-component';
import Scroll from 'react-scroll';

import { callAPIorCache } from '../seessionStorageCache';
import { API_GET_CHART } from '../constants/apiPaths';
import {
  DEFAULT_CHARTS_PER_PAGE,
  DEFAULT_PAGE_TITLE,
} from '../constants/defaults';
import { usePrevious } from '../hooks';
import ChartItemCard from './ChartItemCard';
import TitleHeader from './TitleHeader';

const Charts = ({ location = {}, genreName }) => {
  const { page = 1, genreId = '' } = queryString.parse(location.search || {});
  const prevGenreId = usePrevious(genreId);

  useEffect(() => {
    Scroll.animateScroll.scrollToTop({ duration: 500 });
    fetchChartData(genreId, page);
  }, [fetchChartData, genreId, page]);

  const [chartData, setChartData] = useState({});
  const [chartItems, setChartItems] = useState([]);

  const advancePage = () => {
    const { metadata = {} } = chartData;
    const { page = 0 } = metadata;
    const nextPage = page + 1;

    fetchChartData(genreId, nextPage);
  };

  const fetchChartData = useCallback(
    async (genreId, page) => {
      const beatportChartData = await callAPIorCache(
        `${API_GET_CHART}?${genreId &&
          `facets=genreId:${genreId}`}&publishedOnly=true&page=${page}&perPage=${DEFAULT_CHARTS_PER_PAGE}&sortBy=publishDate+DESC`,
      );

      const { data, status } = beatportChartData;
      if (status !== 200) return;

      setChartData(data);

      // check if genreId changed. if so, do not concat
      if (prevGenreId !== genreId) {
        setChartItems(data.results);
      } else {
        setChartItems([...chartItems, ...data.results]);
      }
    },
    [chartItems, prevGenreId],
  );

  return (
    <>
      <Helmet>
        <title>
          {genreName ? `${genreName} ` : ``}Charts :: {DEFAULT_PAGE_TITLE}
        </title>
      </Helmet>
      <TitleHeader
        headerPrefix='CHARTS'
        headerTitle={genreName || 'All Genres'}
      />
      <InfiniteScroll
        dataLength={chartItems.length}
        next={advancePage}
        hasMore={
          chartItems.length <
          ((chartData.metadata && chartData.metadata.count) ||
            Number.MAX_SAFE_INTEGER)
        }
        loader={<h4>Loading more charts...</h4>}
        scrollThreshold={0.9}
      >
        <Grid columns={4}>
          {chartItems.map((chartItem) => {
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

const mapStateToProps = (state, ownProps) => {
  const { genreListing } = state;

  const { genreId = '' } = queryString.parse(ownProps.location.search || {});
  const genre = genreListing.filter((item) => item.id === +genreId);
  const genreName = genre.length > 0 ? genre[0].name : '';

  return {
    genreName,
  };
};

export default connect(
  mapStateToProps,
  {},
)(Charts);
