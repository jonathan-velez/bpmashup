import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Image, Header, Menu, Button } from 'semantic-ui-react';
import Scroll from 'react-scroll';
import { Link } from 'react-router-dom';

import { getLabelDetail } from '../thunks';
import LoveItem from './LoveItem';
import ShowMore from './ShowMore';
import GenreLabel from './GenreLabel';
import ItemCards from './ItemCards';
import TrackListingGroup from './TrackListingGroup';

class Label extends Component {
  state = {
    activeItem: 'tracks',
  }

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

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  }

  render() {
    const { labelDetail, trackListing, location } = this.props;
    const { activeItem } = this.state;
    const { labelData, releasesData } = labelDetail;
    const { images, name, id, biography, genres } = labelData;
    const imageSrc = images && images.large.secureUrl;
    const { pathname } = location;

    let activeItemContent = null;
    switch (activeItem) {
      case 'releases':
        activeItemContent =
          releasesData &&
          <ItemCards items={releasesData} itemType='release' showHeader={false} />
        break;
      case 'tracks':
        activeItemContent =
          trackListing &&
          <TrackListingGroup trackListing={trackListing} />
        break;
      default:
    }

    return (
      <Fragment>
        <Grid divided stackable>
          {imageSrc &&
            <Grid.Row columns={2}>
              <Grid.Column>
                <Image src={imageSrc} />
              </Grid.Column>
              <Grid.Column textAlign='right'>
                <Header size='huge' className='item-header'>{name} <LoveItem itemType='label' item={{ id }} type='button' /></Header>
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
        </Grid>
        <Menu secondary pointing>
          <Menu.Item
            link
            name='tracks'
            className='item-header'
            active={activeItem === 'tracks'}
            onClick={this.handleItemClick}
          >Top 10 Tracks</Menu.Item>
          <Menu.Item
            link
            name='releases'
            className='item-header'
            active={activeItem === 'releases'}
            onClick={this.handleItemClick}
          >Featured Releases</Menu.Item>

          <Menu.Item position='right'>
            <Button as={Link} to={`${pathname}/tracks`}>
              View All Tracks
            </Button>
          </Menu.Item>
        </Menu>
        {activeItemContent}
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
