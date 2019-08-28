import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import { Transition, Grid, Image, Header } from 'semantic-ui-react';

import ResponsiveTrackListing from './ResponsiveTrackListing';
import GenreLabel from './GenreLabel';
import { fetchChartData } from '../thunks';

class ChartListingController extends Component {
  state = {
    visible: false,
  }

  componentDidMount() {
    const { match, fetchChartData } = this.props;
    const { chartId } = match.params;

    fetchChartData(chartId);
    Scroll.animateScroll.scrollToTop({ duration: 1500 });
    this.setState({
      visible: true,
    })
  }

  render() {
    const { chartListing = {}, isLoading } = this.props;
    const { visible } = this.state;
    const { tracks = [], images = {}, name, description, genres, publishDate } = chartListing;
    const { xlarge = {} } = images;
    const { secureUrl } = xlarge;

    const trackTitleHeader = {
      textAlign: 'left',
      textTransform: 'uppercase',
    }

    return (
      <React.Fragment>
        <Grid>
          <Grid.Row>
            <Grid.Column width={4}>
              <Image src={secureUrl} />
            </Grid.Column>
            <Grid.Column width={8} textAlign='left'>
              <Header as='h1' style={trackTitleHeader}>
                {name}
                <Header.Subheader>{publishDate && `Publish Date:  ${publishDate}`}</Header.Subheader>
              </Header>
              {genres && genres.map((genre, idx) => {
                return (
                  <GenreLabel key={idx} genreName={genre.name} genreSlug={genre.slug} genreId={genre.id} />
                )
              })}
              <p>{description}</p>
            </Grid.Column>
          </Grid.Row>
          {
            tracks.length > 0 ?
              <Transition visible={visible} animation='fade' duration={1500}>
                <ResponsiveTrackListing trackListing={tracks} isPlaylist={false} isLoading={isLoading} page={1} perPage={50} />
              </Transition>
              :
              null
          }
        </Grid>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoading: state.isLoading,
    chartListing: state.chartListing,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({}, { fetchChartData }), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartListingController);
