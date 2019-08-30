import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Image, Header, Statistic, Card, Divider, Transition, Message, Pagination } from 'semantic-ui-react';
import Scroll from 'react-scroll';

import TrackListingCards from './TrackListingCards';
import TrackAlbum from './TrackAlbum';
import TrackCardActionRow from './TrackCardActionRow';
import { constructLinks, constructTrackLink } from '../utils/trackUtils';
import { musicalKeyFilter } from '../utils/helpers';
import { callAPIorCache } from '../seessionStorageCache';
import { API_GET_TRACKS, API_GET_CHART } from '../constants/apiPaths';
import { DEFAULT_BP_ITEM_IMAGE_URL } from '../constants/defaults';
const chartsPerPage = 8;

class Track extends React.Component {
  state = {
    trackData: {},
    chartData: {
      metadata: {},
      results: [],
    },
    similarTracksData: [],
    visible: false,
  }

  async componentDidMount() {
    const { location = {}, match = {} } = this.props;
    const { params = {} } = match;
    const { state = {} } = location;
    const { track = {} } = state;
    let { charts = [] } = track;

    if (Object.keys(track).length === 0) {
      const { trackId } = params;
      const trackData = await this.fetchTrackData(trackId);

      if (trackData) {
        Object.assign(track, trackData);
        charts = track.charts;
      }
    }

    this.setState({
      visible: true,
      trackData: track,
    });

    Scroll.animateScroll.scrollToTop({ duration: 1500 });

    if (charts && charts.length > 0) {
      this.fetchChartData(charts.map(chart => chart.id).join(','));
    }

    this.fetchSimilarTracksData(track.id);
  }

  async componentWillReceiveProps(nextProps) {
    const { match = {} } = this.props;
    const { params = {} } = match;
    const { trackId } = params;

    const { match: nextMatch = {} } = nextProps;
    const { params: nextParams = {} } = nextMatch;
    const { trackId: nextTrackId } = nextParams;

    if (trackId === nextTrackId) {
      return;
    }

    const trackData = await this.fetchTrackData(trackId);

    if (!trackData) {
      return;
    }

    this.setState({
      visible: true,
      trackData,
    });

    const { charts } = trackData;

    Scroll.animateScroll.scrollToTop({ duration: 1500 });

    if (charts && charts.length > 0) {
      this.fetchChartData(charts.map(chart => chart.id).join(','));
    }

    this.fetchSimilarTracksData(trackId);
  }

  fetchTrackData = async (trackId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const trackData = await callAPIorCache(`${API_GET_TRACKS}?id=${trackId}`);
        const { data = {}, status } = trackData;
        if (status !== 200) {
          return reject();
        }

        const { results = [] } = data;

        if (results && results.length > 0) {
          return resolve(data.results[0]);
        }
      } catch (error) {
        return reject(error);
      }
    })
  }

  fetchChartData = async (chartIds, page = 1, perPage = chartsPerPage) => {
    const chartData = await callAPIorCache(`${API_GET_CHART}?ids=${chartIds}&page=${page}&perPage=${perPage}`);
    const { data, status } = chartData;
    if (status !== 200) return;

    if (data.results && data.results.length > 0) {
      this.setState({
        chartData: data,
      })
    }
  }

  fetchSimilarTracksData = async (trackId) => {
    const tracksData = await callAPIorCache(`/api/tracks/similar?id=${trackId}&perPage=10&page=1`);
    const { data, status } = tracksData;
    if (status !== 200) return;

    if (data.results && data.results.length > 0) {
      this.setState({
        similarTracksData: data.results,
      })
    }
  }

  handleChartPageChange = (e, data) => {
    const { activePage = 1 } = data;
    const { trackData = {} } = this.state;
    const { charts = [] } = trackData;
    if (charts.length === 0) return;

    this.fetchChartData(charts.map(chart => chart.id).join(','), activePage);
  }

  render() {
    const { location = {}, userDetail = {} } = this.props;
    const { visible, chartData, trackData, similarTracksData } = this.state;
    const { permissions = [] } = userDetail;
    const canZip = Array.isArray(permissions) && permissions.includes('zipZip');
    const { state = {} } = location;
    const { track = trackData } = state;
    const { images = {}, artists = [], length = '', bpm = '', label = '', key = {}, releaseDate = '', genres = [], release = '' } = track;

    const { results: chartDataResults, metadata: chartDataMetadata } = chartData;
    const chartTotalPages = (chartDataMetadata && chartDataMetadata.totalPages) || 0;

    if (Object.keys(track).length === 0) {
      return (
        <Message warning>
          <Header size='huge'>Hey!</Header>
          <p>Nothing to display.</p>
        </Message>
      )
    }

    return (
      <Transition visible={visible} animation='fade' duration={500}>
        <Grid stackable>
          <Grid.Row stretched>
            <Grid.Column width={4}>
              {track &&
                <TrackAlbum
                  imageUrl={images.large ? images.large.secureUrl : DEFAULT_BP_ITEM_IMAGE_URL}
                  track={track}
                  imageSize='medium'
                />
              }
            </Grid.Column>
            <Grid.Column width={12}>
              <Header as='h1' className='track-title'>
                {constructTrackLink(track, 'black-font')}
                <Header.Subheader>
                  {constructLinks(artists, 'artist')}
                </Header.Subheader>
                <Header.Subheader>
                  {release.id &&
                    <Link to={`/release/${release.slug}/${release.id}`}>{release.name}</Link>
                  }
                </Header.Subheader>
              </Header>
              <Image src={images.waveform.secureUrl} />
            </Grid.Column>
            <Grid.Column width={4}>
              <TrackCardActionRow canZip={canZip} numOfButtons={canZip ? 'three' : 'two'} track={track} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns='equal' divided>
            <Grid.Column>
              <Statistic size='mini'>
                <Statistic.Label>LENGTH</Statistic.Label>
                <Statistic.Value>{length}</Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column>
              <Statistic size='mini'>
                <Statistic.Label>RELEASED</Statistic.Label>
                <Statistic.Value>{releaseDate}</Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column>
              <Statistic size='mini'>
                <Statistic.Label>BPM</Statistic.Label>
                <Statistic.Value>{bpm}</Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column>
              <Statistic size='mini'>
                <Statistic.Label>KEY</Statistic.Label>
                <Statistic.Value>{musicalKeyFilter(key && key.shortName)}</Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column>
              <Statistic size='mini'>
                <Statistic.Label>GENRE</Statistic.Label>
                <Statistic.Value>{constructLinks(genres, 'genre')}</Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column>
              <Statistic size='mini'>
                <Statistic.Label>LABEL</Statistic.Label>
                <Statistic.Value><Link to={`/label/${label.slug}/${label.id}`}>{label.name}</Link></Statistic.Value>
              </Statistic>
            </Grid.Column>
          </Grid.Row>
          {chartTotalPages > 0 &&
            <React.Fragment>
              <Divider />
              <Grid.Row width={16}>
                <Header as='h3' className='track-title'>Appears on these Charts</Header>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Card.Group
                    stackable
                    itemsPerRow={chartsPerPage}
                    className='trackListingCardGroup'
                  >
                    {chartDataResults && chartDataResults.length > 0 &&
                      chartDataResults.map((chart, idx) =>
                        idx < chartsPerPage &&
                        <Card className='flex-card' key={chart.sku} as={Link} to={`/chart/${chart.slug}/${chart.id}`}>
                          <Image src={chart.images && chart.images.xlarge ? chart.images.xlarge.secureUrl : DEFAULT_BP_ITEM_IMAGE_URL} className='flex-card' />
                          <Card.Content>
                            {chart.name}
                          </Card.Content>
                        </Card>
                      )
                    }
                  </Card.Group>
                </Grid.Column>
              </Grid.Row>
              {chartTotalPages > 1 &&
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Pagination
                      defaultActivePage={1}
                      firstItem={null}
                      lastItem={null}
                      pointing
                      secondary
                      totalPages={chartTotalPages}
                      onPageChange={this.handleChartPageChange}
                    />
                  </Grid.Column>
                </Grid.Row>
              }
            </React.Fragment>
          }
          {similarTracksData && similarTracksData.length > 0 &&
            <React.Fragment>
              <Divider />
              <Grid.Row width={16}>
                <Header as='h3' className='track-title'>Similar Tracks</Header>
              </Grid.Row>
            </React.Fragment>
          }
          <Grid.Row>
            <Grid.Column width={16}>
              {similarTracksData && similarTracksData.length > 0 &&
                <TrackListingCards trackListing={similarTracksData} itemsPerRow={4} showPosition={false} />
              }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Transition >
    );
  }
}

const mapStateToProps = state => {
  return {
    userDetail: state.userDetail,
  }
}

export default connect(mapStateToProps, null)(Track);
