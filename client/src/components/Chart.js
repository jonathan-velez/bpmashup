import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import queryString from 'query-string';
import { Transition, Grid, Image, Header, Segment } from 'semantic-ui-react';

import TrackListingGroup from './TrackListingGroup';
import GenreLabel from './GenreLabel';
import { fetchChartDataById } from '../thunks';
import { getPerPageSetting } from '../utils/helpers';
import { DEFAULT_PAGE } from '../constants/defaults';

const Chart = ({
  location,
  match,
  fetchChartDataById,
  chartListing = {},
  trackListing,
}) => {
  const [visible, setVisible] = useState(false);
  const { chartId } = match.params;
  const {
    page = DEFAULT_PAGE,
    perPage = getPerPageSetting(),
  } = queryString.parse(location.search);

  useEffect(() => {
    if (chartId) {
      fetchChartDataById(chartId, page, perPage);
      Scroll.animateScroll.scrollToTop({ duration: 1500 });
      setVisible(true);
    }
  }, [fetchChartDataById, chartId, page, perPage]);

  const {
    images = {},
    name,
    description,
    genres,
    publishDate,
    chartOwner = {},
  } = chartListing;
  const { xlarge = {} } = images;
  const { secureUrl } = xlarge;
  const { name: chartOwnerName } = chartOwner;

  const trackTitleHeader = {
    textAlign: 'left',
    textTransform: 'uppercase',
  };

  return (
    <React.Fragment>
      <Segment placeholder padded='very'>
        <Grid>
          <Grid.Row>
            <Grid.Column width={4}>
              <Image src={secureUrl} />
            </Grid.Column>
            <Grid.Column width={8} textAlign='left'>
              <Header as='h1' style={trackTitleHeader}>
                {name}
                {chartOwnerName && (
                  <Header.Subheader>{chartOwnerName}</Header.Subheader>
                )}
                {publishDate && (
                  <Header.Subheader>{publishDate}</Header.Subheader>
                )}
              </Header>
              {genres &&
                genres.map((genre, idx) => {
                  return (
                    <GenreLabel
                      key={idx}
                      genreName={genre.name}
                      genreSlug={genre.slug}
                      genreId={genre.id}
                    />
                  );
                })}
              <p>{description}</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Transition visible={visible} animation='fade' duration={1500}>
        <TrackListingGroup trackListing={trackListing} />
      </Transition>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const { isLoading, chartListing, trackListing } = state;

  return {
    isLoading,
    chartListing,
    trackListing,
  };
};

const mapDispatchToProps = { fetchChartDataById };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chart);
