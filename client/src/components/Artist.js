import React, { Component, Fragment } from 'react';
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

class Artist extends Component {
  state = {
    activeItem: 'biography',
    activeItem2: 'releases',
  }

  componentDidMount() {
    this.fetchArtistData();
  }

  componentDidUpdate(prevProps) {
    if (+prevProps.match.params.artistId !== +this.props.match.params.artistId) {
      this.fetchArtistData();
    }
  }

  fetchArtistData() {
    Scroll.animateScroll.scrollToTop({ duration: 1500 });
    const artist = {
      artistId: this.props.match.params.artistId,
      artistName: this.props.match.params.artistName
    }
    this.props.getArtistDetails(artist);
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  }

  handleItemClick2 = (e, { name }) => {
    this.setState({ activeItem2: name });
  }

  render() {
    const { artistDetail, trackListing } = this.props;
    const { activeItem, activeItem2 } = this.state;
    const { artistData = {}, eventsData = [] } = artistDetail;
    const { name, id, biography, images, genres, featuredReleases } = artistData;
    const imageSrc = images && images.large.secureUrl;

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
          <div style={stylez}><EventsList eventsData={eventsData} /></div>
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
    }
    const stylez = {
      maxHeight: '405px',
      overflowY: 'scroll',
    }
    return (
      <Fragment>
        <Grid divided stackable>
          {imageSrc &&
            <React.Fragment>
              <Grid.Row columns={1}>
                <Grid.Column>
                  <Header floated='right' size='huge' className='item-header'>{name} <LoveItem type='artist' item={{ id }} /></Header>
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
                      onClick={this.handleItemClick}
                    >Biography</Menu.Item>
                    <Menu.Item
                      link
                      name='genres'
                      className='item-header'
                      active={activeItem === 'genres'}
                      onClick={this.handleItemClick}
                    >Genres</Menu.Item>
                    <Menu.Item
                      link
                      name='events'
                      className='item-header'
                      active={activeItem === 'events'}
                      onClick={this.handleItemClick}
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
            name='releases'
            className='item-header'
            active={activeItem2 === 'releases'}
            onClick={this.handleItemClick2}
          >Featured Releases</Menu.Item>
          <Menu.Item
            link
            name='tracks'
            className='item-header'
            active={activeItem2 === 'tracks'}
            onClick={this.handleItemClick2}
          >Top 10 Tracks</Menu.Item>
          <Menu.Item position='right'>
            <Button as={Link} to={`tracks`}>
              View All Tracks
            </Button>
          </Menu.Item>
        </Menu>
        {activeItemContent2}
      </Fragment>
    );
  }
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
