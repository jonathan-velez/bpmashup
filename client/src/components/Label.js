import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Image, Header } from 'semantic-ui-react';
import Scroll from 'react-scroll';

import { getLabelDetail } from '../thunks';
import LoveItem from './LoveItem';
import ShowMore from './ShowMore';
import GenreLabel from './GenreLabel';
import ItemCards from './ItemCards';
import TrackListingGroup from './TrackListingGroup';

class Label extends Component {
  componentDidMount() {
    this.fetchLabelDetails();
  }

  componentDidUpdate(prevProps) {
    if (+prevProps.match.params.labelId !== +this.props.match.params.labelId) {
      this.fetchLabelDetails();
    }
  }

  fetchLabelDetails() {
    Scroll.animateScroll.scrollToTop({ duration: 1500 });
    this.props.getLabelDetail(this.props.match.params.labelId);
  }

  render() {
    const { labelDetail, trackListing } = this.props;
    const { labelData, releasesData } = labelDetail;
    const { images, name, id, biography, genres } = labelData;
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
                <Header size='huge'>{name} <LoveItem type='label' item={{ id }} /></Header>
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
          {releasesData &&
            <ItemCards items={releasesData} itemType='release' />
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
    labelDetail: state.labelDetail,
    trackListing: state.trackListing,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getLabelDetail }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Label);
