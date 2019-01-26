import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Image, Header } from 'semantic-ui-react';
import Scroll from 'react-scroll';

import { getArtistThunk, getArtistEvents } from '../thunks/artistThunk';
import ResponsiveTrackListing from './ResponsiveTrackListing';
import ItemCards from './ItemCards';
import GenreLabel from './GenreLabel';
import EventsList from './EventsList';
import LoveItem from './LoveItem';
import ShowMore from './ShowMore';

class Artist extends Component {
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
    this.props.getArtistThunk(this.props.match.params.artistId);
    this.props.getArtistEvents(this.props.match.params.artistName);
  }

  render() {
    const { artistDetail, trackListing } = this.props;
    const { artistData, events } = artistDetail;
    const { name, id, biography, images, genres, featuredReleases } = artistData;
    const imageSrc = images && images.large.secureUrl;

    return (
      <Fragment>
        <Grid divided stackable>
          {imageSrc &&
            <Grid.Row columns={2}>
              <Grid.Column>
                <Image src={imageSrc} />
              </Grid.Column>
              <Grid.Column textAlign='right'>
                <Header size='huge'>{name} <LoveItem type='artist' item={{ id }} /></Header>
                {/* <div>{biography}</div> */}
                <ShowMore content={biography} />
              </Grid.Column>
            </Grid.Row>
          }
          {genres &&
            <Grid.Row columns={1}>
              <Grid.Column>
                <Header textAlign='left' dividing>GENRES</Header>
                {genres && genres.map((genre, idx) => {
                  return (
                    <GenreLabel key={idx} genreName={genre.name} genreSlug={genre.slug} genreId={genre.id} />
                  )
                })}
              </Grid.Column>
            </Grid.Row>
          }
          {events && events.length > 0 &&
            <Grid.Row columns={1} textAlign='left'>
              <Grid.Column>
                <Header textAlign='left' dividing>UPCOMING EVENTS</Header>
                <EventsList events={events} />
              </Grid.Column>
            </Grid.Row>
          }
          {featuredReleases &&
            <ItemCards items={featuredReleases} itemType='release' />
          }
        </Grid>
        {trackListing.tracks && trackListing.tracks.length > 0 &&
          <React.Fragment>
            <Header textAlign='left' dividing>TRACKS</Header>
            <ResponsiveTrackListing trackListing={trackListing.tracks} isPlaylist={true} isLoading={false} page={1} perPage={10} />
          </React.Fragment>
        }
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
  return bindActionCreators({ getArtistThunk, getArtistEvents }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Artist);
