import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import queryString from 'query-string';
import { Transition, Grid, Image, Header, Segment } from 'semantic-ui-react';

import TrackListingGroup from './TrackListingGroup';
import TrackAlbum from './TrackAlbum';
import GenreLabel from './GenreLabel';
import LoveItem from './LoveItem';
import { fetchChartDataById } from '../thunks';
import { getPerPageSetting } from '../utils/helpers';
import { DEFAULT_PAGE, DEFAULT_PAGE_TITLE } from '../constants/defaults';

const Chart = ({
  location,
  match,
  fetchChartDataById,
  chartListing = {},
  trackListing,
  firstTrack,
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
    id,
    slug,
    images = {},
    name,
    description,
    genres,
    publishDate,
    chartOwner = {},
  } = chartListing;
  const { xlarge = {} } = images;
  const { secureUrl } = xlarge;
  const { name: chartOwnerName } = chartOwner || {};

  let pageTitle = '';
  if (name) {
    pageTitle = name;

    if (chartOwnerName) {
      pageTitle = pageTitle + ' by ' + chartOwnerName;
    }

    pageTitle = pageTitle + ' :: ';
  }

  pageTitle = pageTitle + DEFAULT_PAGE_TITLE;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <Segment placeholder padded='very'>
        <Grid>
          <Grid.Row>
            <Grid.Column width={4}>
              {firstTrack ? (
                <TrackAlbum imageUrl={secureUrl} track={firstTrack} />
              ) : (
                <Image src={secureUrl} />
              )}
            </Grid.Column>
            <Grid.Column width={8} textAlign='left'>
              <Header size='huge' className='item-header'>
                {name}{' '}
                <LoveItem
                  itemType='chart'
                  item={{ id, name, slug }}
                  type='button'
                  style={{ float: 'right' }}
                />
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
    </>
  );
};

const mapStateToProps = (state) => {
  const { isLoading, chartListing, trackListing } = state;
  const { tracks = {} } = trackListing;
  const trackKeys = Object.keys(tracks);
  const firstTrack = tracks[trackKeys[0]];

  return {
    isLoading,
    chartListing,
    trackListing,
    firstTrack,
  };
};

const mapDispatchToProps = { fetchChartDataById };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chart);
