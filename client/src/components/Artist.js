import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Grid, Image, Header, Menu, Button } from 'semantic-ui-react';
import Scroll from 'react-scroll';

import { getArtistDetails } from '../thunks';
import TrackListingGroup from './TrackListingGroup';
import ItemCards from './ItemCards';
import EventsList from './EventsList';
import LoveItem from './LoveItem';
import ShowMore from './ShowMore';
import ChartSlider from './ChartSlider';
import ReleaseList from './ReleaseList';
import { DEFAULT_PAGE_TITLE } from '../constants/defaults';

const Artist = ({
  match,
  getArtistDetails,
  artistDetail,
  trackListing,
  location,
}) => {
  const [activeItem, setActiveItem] = useState('biography');
  const [activeItem2, setActiveItem2] = useState('top-tracks');

  const { params } = match;
  const { artistId, artistName } = params;
  const { artistData = {}, eventsData = [] } = artistDetail;

  const {
    name,
    id,
    bio,
    image = {},
    slug,
    charts,
    featuredReleases,
  } = artistData;

  const imageSrc = image.uri;
  const { pathname } = location;
  const eventStyle = {
    maxHeight: '405px',
    overflowY: 'scroll',
  };

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

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };

  const handleItemClick2 = (e, { name }) => {
    setActiveItem2(name);
  };

  if (Object.keys(artistData).length === 0) return null; // TODO: do something nicer here

  // TODO: Keep activeItem state in sessionStorage
  let activeItemContent = null;
  switch (activeItem) {
    case 'biography':
      activeItemContent = bio && <ShowMore content={bio} />;
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
    case 'charts':
      activeItemContent2 = charts && <ChartSlider charts={charts} />;
      break;
    case 'all-releases':
      activeItemContent2 = <ReleaseList artistId={artistId} />;
      break;
    default:
  }

  return (
    <>
      <Helmet>
        <title>
          {name ? `${name} :: ` : ``}
          {DEFAULT_PAGE_TITLE}
        </title>
      </Helmet>
      <Grid divided stackable>
        {imageSrc && (
          <>
            <Grid.Row columns={1}>
              <Grid.Column>
                <Header floated='right' size='huge' className='item-header'>
                  {name}{' '}
                  <LoveItem
                    itemType='artist'
                    item={{ id, name, slug }}
                    type='button'
                  />
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
          </>
        )}
      </Grid>
      <Menu secondary pointing>
        <Menu.Item
          link
          name='top-tracks'
          className='item-header'
          active={activeItem2 === 'top-tracks'}
          onClick={handleItemClick2}
        >
          Top Tracks
        </Menu.Item>
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
          name='charts'
          className='item-header'
          active={activeItem2 === 'charts'}
          onClick={handleItemClick2}
        >
          Charts
        </Menu.Item>
        <Menu.Item position='right'>
          <Button basic as={Link} to={`${pathname}/tracks`}>
            View All Tracks
          </Button>
        </Menu.Item>
      </Menu>
      {activeItemContent2}
    </>
  );
};

const mapStateToProps = (state) => {
  const { artistDetail, trackListing } = state;

  return {
    artistDetail,
    trackListing,
  };
};

const mapDispatchToProps = {
  getArtistDetails,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(Artist));
