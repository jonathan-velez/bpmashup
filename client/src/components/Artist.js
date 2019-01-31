import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Image, Header } from 'semantic-ui-react';
import Scroll from 'react-scroll';

import { getArtistDetails } from '../thunks';
import TrackListingGroup from './TrackListingGroup';
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
    const artist = {
      artistId: this.props.match.params.artistId,
      artistName: this.props.match.params.artistName
    }
    this.props.getArtistDetails(artist);
  }

  render() {
    const { artistDetail, trackListing } = this.props;
    const { artistData = {}, eventsData = [] } = artistDetail;
    const { name, id, biography, images, genres, featuredReleases } = artistData;
    const imageSrc = images && images.large.secureUrl;
    if (Object.keys(artistData).length === 0) return null; // TODO: do something nicer here
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
                {biography && <ShowMore content={biography} />}
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
          {eventsData && eventsData.length > 0 &&
            <Grid.Row columns={1} textAlign='left'>
              <Grid.Column>
                <Header textAlign='left' dividing>UPCOMING EVENTS</Header>
                <EventsList eventsData={eventsData} />
              </Grid.Column>
            </Grid.Row>
          }
          {featuredReleases &&
            <ItemCards items={featuredReleases} itemType='release' />
          }
        </Grid>
        <Header textAlign='left' dividing>TRACKS</Header>
        <TrackListingGroup trackListing={trackListing} />
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
