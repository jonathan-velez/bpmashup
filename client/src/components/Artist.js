import React, { Fragment, useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Grid, Image, Header, Menu, Button } from 'semantic-ui-react';
import Scroll from 'react-scroll';

import { getArtistDetails } from '../thunks';
import TrackListingGroup from './TrackListingGroup';
import ItemCards from './ItemCards';
import GenreLabel from './GenreLabel';
import EventsList from './EventsList';
import LoveItem from './LoveItem';
import ShowMore from './ShowMore';

const Artist = ({ match, getArtistDetails, artistDetail, trackListing, location }) => {
  const [activeItem, setActiveItem] = useState('biography');
  const [activeItem2, setActiveItem2] = useState('tracks');

  const { params } = match;
  const { artistId, artistName } = params;
  const { artistData = {}, eventsData = [] } = artistDetail;
  const { name, id, biography, images, genres, featuredReleases } = artistData;
  const imageSrc = images && images.large.secureUrl;
  const { pathname } = location;
  const eventStyle = {
    maxHeight: '405px',
    overflowY: 'scroll',
  }


  useEffect(() => {
    const fetchArtistData = (artistId) => {
      Scroll.animateScroll.scrollToTop({ duration: 1500 });

      const artist = {
        artistId,
        artistName,
      }

      getArtistDetails(artist);
    }

    fetchArtistData(artistId);
  }, [artistId, artistName, getArtistDetails]);


  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  }

  const handleItemClick2 = (e, { name }) => {
    setActiveItem2(name);
  }

  if (Object.keys(artistData).length === 0) return null; // TODO: do something nicer here

  let activeItemContent = null;
  switch (activeItem) {
    case 'biography':
      activeItemContent = biography && <ShowMore content={biography} />
      break;
    case 'genres':
      activeItemContent = genres && genres.map((genre, idx) => {
        return (
          <GenreLabel key={idx} genreName={genre.name} genreSlug={genre.slug} genreId={genre.id} />
        )
      })
      break;
    case 'events':
      activeItemContent = eventsData && eventsData.length > 0 &&
        <div style={eventStyle}><EventsList eventsData={eventsData} /></div>
      break;
    default:
  }

  let activeItemContent2 = null;
  switch (activeItem2) {
    case 'releases':
      activeItemContent2 =
        featuredReleases &&
        <ItemCards items={featuredReleases} itemType='release' showHeader={false} />
      break;
    case 'tracks':
      activeItemContent2 =
        trackListing &&
        <TrackListingGroup trackListing={trackListing} />
      break;
    default:
  }

  return (
    <Fragment>
      <Grid divided stackable>
        {imageSrc &&
          <React.Fragment>
            <Grid.Row columns={1}>
              <Grid.Column>
                <Header floated='right' size='huge' className='item-header'>{name} <LoveItem itemType='artist' item={{ id }} type='button' /></Header>
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
                  >Biography</Menu.Item>
                  <Menu.Item
                    link
                    name='genres'
                    className='item-header'
                    active={activeItem === 'genres'}
                    onClick={handleItemClick}
                  >Genres</Menu.Item>
                  <Menu.Item
                    link
                    name='events'
                    className='item-header'
                    active={activeItem === 'events'}
                    onClick={handleItemClick}
                  >Events</Menu.Item>
                </Menu>
                {activeItemContent}
              </Grid.Column>
            </Grid.Row>
          </React.Fragment>
        }
      </Grid>
      <Menu secondary pointing>
        <Menu.Item
          link
          name='tracks'
          className='item-header'
          active={activeItem2 === 'tracks'}
          onClick={handleItemClick2}
        >Top Tracks</Menu.Item>
        <Menu.Item
          link
          name='releases'
          className='item-header'
          active={activeItem2 === 'releases'}
          onClick={handleItemClick2}
        >Featured Releases</Menu.Item>
        <Menu.Item position='right'>
          <Button as={Link} to={`${pathname}/tracks`}>
            View All Tracks
            </Button>
        </Menu.Item>
      </Menu>
      {activeItemContent2}
    </Fragment>
  );

}

const mapStateToProps = state => {
  return {
    artistDetail: state.artistDetail,
    trackListing: state.trackListing,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getArtistDetails }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Artist);
