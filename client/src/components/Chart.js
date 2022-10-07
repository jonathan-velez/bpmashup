import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Scroll from 'react-scroll';
import queryString from 'query-string';
import {
  Transition,
  Grid,
  Image,
  Header,
  Segment,
  Button,
} from 'semantic-ui-react';

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
    per_page = getPerPageSetting(),
  } = queryString.parse(location.search);

  useEffect(() => {
    if (chartId) {
      fetchChartDataById(chartId, page, per_page);
      Scroll.animateScroll.scrollToTop({ duration: 1500 });
      setVisible(true);
    }
  }, [fetchChartDataById, chartId, page, per_page]);

  const {
    id,
    slug,
    image =  {},
    name,
    description,
    genres,
    publishDate,
    person = {},
  } = chartListing;
  const { owner_name: chartOwnerName, owner_slug: chartOwnerSlug, id: chartOwnerId } =
    person || {};

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
          <Grid.Row stretched>
            <Grid.Column width={4} verticalAlign='middle'>
              {firstTrack ? (
                <TrackAlbum imageUrl={image.uri} track={firstTrack} />
              ) : (
                <Image src={image.uri} />
              )}
            </Grid.Column>
            <Grid.Column width={12} textAlign='left'>
              <div>
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
              </div>
              <div>
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
              </div>
              <div>
                <p>{description}</p>
              </div>
              <div>
                <Button
                  basic
                  size='medium'
                  style={{ float: 'left' }}
                  as={Link}
                  to={`/charts/${chartOwnerSlug}/${chartOwnerId}`}
                >
                  View all of {chartOwnerName}'s charts
                </Button>
              </div>
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
