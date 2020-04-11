import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Grid, Image, Header, Menu, Button } from 'semantic-ui-react';
import Scroll from 'react-scroll';

import { getArtistDetails, fetchChartsByProfileId } from '../thunks';
import TrackListingGroup from './TrackListingGroup';
import TracksController from './TracksController';
import ItemCards from './ItemCards';
import GenreLabel from './GenreLabel';
import EventsList from './EventsList';
import LoveItem from './LoveItem';
import ShowMore from './ShowMore';
import ChartSlider from './ChartSlider';
import ReleaseList from './ReleaseList';

const Artist = ({
  match,
  getArtistDetails,
  fetchChartsByProfileId,
  artistDetail,
  trackListing,
  chartsList,
  location,
}) => {
  const [activeItem, setActiveItem] = useState('biography');
  const [activeItem2, setActiveItem2] = useState('featured-releases');

  const { params } = match;
  const { artistId, artistName } = params;
  const { artistData = {}, eventsData = [] } = artistDetail;
  const {
    name,
    id,
    biography,
    images,
    genres,
    featuredReleases,
    profile,
  } = artistData;

  const imageSrc = images && images.large.secureUrl;
  const { pathname } = location;
  const eventStyle = {
    maxHeight: '405px',
    overflowY: 'scroll',
  };
  const { id: profileId } = profile || {};

  const { results = {} } = chartsList;
  let { charts = [] } = results;

  useEffect(() => {
    const fetchArtistData = (artistId) => {
      Scroll.animateScroll.scrollToTop({ duration: 1500 });

      const artist = {
        artistId,
        artistName,
      };

      getArtistDetails(artist);
    };

    fetchArtistData(artistId);
  }, [artistId, artistName, getArtistDetails]);

  useEffect(() => {
    fetchChartsByProfileId(profileId);
  }, [fetchChartsByProfileId, profileId]);

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };

  const handleItemClick2 = (e, { name }) => {
    setActiveItem2(name);
  };

  if (Object.keys(artistData).length === 0) return null; // TODO: do something nicer here

  let activeItemContent = null;
  switch (activeItem) {
    case 'biography':
      activeItemContent = biography && <ShowMore content={biography} />;
      break;
    case 'genres':
      activeItemContent =
        genres &&
        genres.map((genre, idx) => {
          return (
            <GenreLabel
              key={idx}
              genreName={genre.name}
              genreSlug={genre.slug}
              genreId={genre.id}
            />
          );
        });
      break;
    case 'events':
      activeItemContent = eventsData && eventsData.length > 0 && (
        <div style={eventStyle}>
          <EventsList eventsData={eventsData} />
        </div>
      );
      break;
    default:
  }

  let activeItemContent2 = null;
  switch (activeItem2) {
    case 'featured-releases':
      activeItemContent2 = featuredReleases && (
        <ItemCards
          items={featuredReleases}
          itemType='release'
          showHeader={false}
        />
      );
      break;
    case 'top-tracks':
      activeItemContent2 = trackListing && (
        <TrackListingGroup trackListing={trackListing} />
      );
      break;
    case 'all-tracks':
      activeItemContent2 = <TracksController trackQuery={{ artistId }} />;
      break;
    case 'charts':
      activeItemContent2 = charts && <ChartSlider charts={charts} />;
      break;
    case 'all-releases':
      activeItemContent2 = <ReleaseList artistId={artistId} />;
      break;
    default:
  }

  return (
    <Fragment>
      <Grid divided stackable>
        {imageSrc && (
          <React.Fragment>
            <Grid.Row columns={1}>
              <Grid.Column>
                <Header floated='right' size='huge' className='item-header'>
                  {name}{' '}
                  <LoveItem itemType='artist' item={{ id }} type='button' />
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Image src={imageSrc} />
              </Grid.Column>
              <Grid.Column textAlign='right'>
                <Menu secondary pointing>
                  <Menu.Item
                    link
                    name='biography'
                    className='item-header'
                    active={activeItem === 'biography'}
                    onClick={handleItemClick}
                  >
                    Biography
                  </Menu.Item>
                  <Menu.Item
                    link
                    name='genres'
                    className='item-header'
                    active={activeItem === 'genres'}
                    onClick={handleItemClick}
                  >
                    Genres
                  </Menu.Item>
                  <Menu.Item
                    link
                    name='events'
                    className='item-header'
                    active={activeItem === 'events'}
                    onClick={handleItemClick}
                  >
                    Events
                  </Menu.Item>
                </Menu>
                {activeItemContent}
              </Grid.Column>
            </Grid.Row>
          </React.Fragment>
        )}
      </Grid>
      <Menu secondary pointing>
        <Menu.Item
          link
          name='featured-releases'
          className='item-header'
          active={activeItem2 === 'featured-releases'}
          onClick={handleItemClick2}
        >
          Featured Releases
        </Menu.Item>
        <Menu.Item
          link
          name='all-releases'
          className='item-header'
          active={activeItem2 === 'all-releases'}
          onClick={handleItemClick2}
        >
          All Releases
        </Menu.Item>
        <Menu.Item
          link
          name='top-tracks'
          className='item-header'
          active={activeItem2 === 'top-tracks'}
          onClick={handleItemClick2}
        >
          Top 10 Tracks
        </Menu.Item>
        <Menu.Item
          link
          name='all-tracks'
          className='item-header'
          active={activeItem2 === 'all-tracks'}
          onClick={handleItemClick2}
        >
          Tracks
        </Menu.Item>
        <Menu.Item
          link
          name='charts'
          className='item-header'
          active={activeItem2 === 'charts'}
          onClick={handleItemClick2}
        >
          Charts
        </Menu.Item>
      </Menu>
      {activeItemContent2}
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  const { artistDetail, trackListing, chartsList } = state;

  return {
    artistDetail,
    trackListing,
    chartsList,
  };
};

const mapDispatchToProps = {
  getArtistDetails,
  fetchChartsByProfileId,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Artist);
