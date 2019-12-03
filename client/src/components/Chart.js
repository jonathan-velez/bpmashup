import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import { Transition, Grid, Image, Header, Segment } from 'semantic-ui-react';

import ResponsiveTrackListing from './ResponsiveTrackListing';
import GenreLabel from './GenreLabel';
import { fetchChartDataById } from '../thunks';

const Chart = ({ match, fetchChartDataById, chartListing = {}, isLoading }) => {
  const [visible, setVisible] = useState(false);
  const { chartId } = match.params;

  useEffect(() => {
    if (chartId) {
      fetchChartDataById(chartId);
      Scroll.animateScroll.scrollToTop({ duration: 1500 });
      setVisible(true);
    }
  }, [fetchChartDataById, chartId]);

  const { tracks = [], images = {}, name, description, genres, publishDate, chartOwner = {} } = chartListing;
  const { xlarge = {} } = images;
  const { secureUrl } = xlarge;
  const { name: chartOwnerName } = chartOwner;

  const trackTitleHeader = {
    textAlign: 'left',
    textTransform: 'uppercase',
  }

  return (
    <React.Fragment>
      <Segment placeholder padded='very'>
        <Grid>
          <Grid.Row>
            <Grid.Column width={4}>
              <Image src={secureUrl} />
            </Grid.Column>
            <Grid.Column width={8} textAlign='left'>
              <Header as='h1' style={trackTitleHeader}>
                {name}
                {chartOwnerName && <Header.Subheader>{chartOwnerName}</Header.Subheader>}
                {publishDate && <Header.Subheader>{publishDate}</Header.Subheader>}
              </Header>
              {genres && genres.map((genre, idx) => {
                return (
                  <GenreLabel key={idx} genreName={genre.name} genreSlug={genre.slug} genreId={genre.id} />
                )
              })}
              <p>{description}</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      {
        tracks.length > 0 ?
          <Transition visible={visible} animation='fade' duration={1500}>
            <ResponsiveTrackListing trackListing={tracks} isPlaylist={false} isLoading={isLoading} page={1} perPage={50} />
          </Transition>
          :
          null
      }
    </React.Fragment>
  );
}

const mapStateToProps = state => {
  return {
    isLoading: state.isLoading,
    chartListing: state.chartListing,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(Object.assign({}, { fetchChartDataById }), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
