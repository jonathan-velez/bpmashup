import React, { useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Image, Header, Statistic, Card, Divider, Transition, Pagination, Segment } from 'semantic-ui-react';
import { animateScroll } from 'react-scroll';

import TrackListingCards from './TrackListingCards';
import TrackAlbum from './TrackAlbum';
import TrackCardActionRow from './TrackCardActionRow';
import NothingHereMessage from './NothingHereMessage';
import { constructLinks, constructTrackLink } from '../utils/trackUtils';
import { musicalKeyFilter } from '../utils/helpers';
import { callAPIorCache } from '../seessionStorageCache';
import { API_GET_TRACKS, API_GET_CHART } from '../constants/apiPaths';
import { DEFAULT_BP_ITEM_IMAGE_URL } from '../constants/defaults';
import { hasZippyPermission } from '../selectors';

const Track = ({ location = {}, match = {}, canZip }) => {
  const chartsPerPage = 8;
  const { params = {} } = match;
  const { trackId: trackIdParam } = params;
  const { state: stateProp = {} } = location;
  const { track: trackProp = {} } = stateProp;

  const initialState = {
    trackData: {},
    chartData: {
      metadata: {},
      results: [],
    },
    similarTracksData: [],
    visible: false,
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'load_track_data': {
        return {
          ...state,
          visible: true,
          trackData: action.payload,
        }
      }
      case 'load_chart_data': {
        return {
          ...state,
          chartData: action.payload,
        }
      }
      case 'load_similar_tracks_data': {
        return {
          ...state,
          similarTracksData: action.payload,
        }
      }
      default: {
        return state;
      }
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const loadData = async (trackProp) => {
    // Track object (trackProp) is passed as prop in location.state if the user lands here through <Link />
    // If the user lands here via other means, we need to fetch the Track data
    // Once we have Track data, we need to fetch the list of Charts the track is on
    // Lastly, we fetch similar tracks
    const trackData = await loadTrackDataFromPropsOrFetch(trackProp);
    const { charts = [], id } = trackData;

    if (charts.length > 0) {
      await loadChartData(charts);
    }

    if (id) {
      await loadSimilarTracksData(id);
    }
    animateScroll.scrollToTop({ duration: 1500 });
  }

  const loadTrackDataFromPropsOrFetch = async (trackProp) => {
    let trackData;

    if (!trackProp.id) {
      trackData = await fetchTrackData(trackIdParam);
    } else {
      trackData = trackProp;
    }

    dispatch({
      type: 'load_track_data',
      payload: trackData,
    });

    return trackData;
  }

  const loadChartData = async (charts = [], page = 1, perPage = chartsPerPage) => {
    if (charts.length > 0) {
      const chartData = await fetchChartData(charts.map(chart => chart.id).join(','), page, perPage);

      if (chartData.results && chartData.results.length > 0) {
        dispatch({
          type: 'load_chart_data',
          payload: chartData,
        })
      }
    }
  }

  const loadSimilarTracksData = async (trackId) => {
    if (!trackId) return;

    const similarTracksData = await fetchSimilarTracksData(trackId);
    dispatch({
      type: 'load_similar_tracks_data',
      payload: similarTracksData,
    })
  }

  const fetchTrackData = async (trackId) => {
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

        return resolve({});
      } catch (error) {
        return reject(error);
      }
    })
  }

  const fetchChartData = async (chartIds, page = 1, perPage = chartsPerPage) => {
    return new Promise(async (resolve, reject) => {

      try {
        const chartData = await callAPIorCache(`${API_GET_CHART}?ids=${chartIds}&page=${page}&perPage=${perPage}`);
        const { data, status } = chartData;
        if (status !== 200) return;

        return resolve(data);
      } catch (error) {
        return reject(error);
      }
    })
  }

  const fetchSimilarTracksData = async (trackId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const tracksData = await callAPIorCache(`/api/tracks/similar?id=${trackId}&perPage=10&page=1`);
        const { data, status } = tracksData;
        if (status !== 200) {
          return reject();
        }

        if (data.results && data.results.length > 0) {
          return resolve(data.results);
        }
        return resolve([]);

      } catch (error) {
        reject(error);
      }
    })
  }

  useEffect(() => {
    loadData(trackProp);
  }, [trackIdParam]);


  const handleChartPageChange = (e, data) => {
    const { activePage = 1 } = data;
    const { trackData = {} } = state;
    const { charts = [] } = trackData;

    if (charts.length === 0) return;

    loadChartData(charts, activePage);
  }

  const { visible = false, chartData = [], trackData = {}, similarTracksData = [] } = state;
  const { images = {}, artists = [], length = '', bpm = '', label = '', key = {}, releaseDate = '', genres = [], release = '', id } = trackData;

  const { results: chartDataResults, metadata: chartDataMetadata } = chartData;
  const chartTotalPages = (chartDataMetadata && chartDataMetadata.totalPages) || 0;

  if (!id) {
    return <NothingHereMessage />
  }

  // TODO: refactor segments into individual components, add loaders for each
  return (
    <Transition visible={visible} animation='fade' duration={500}>
      <React.Fragment>
        <Segment placeholder padded='very'>
          <Grid stackable>
            <Grid.Row stretched>
              <Grid.Column width={4}>
                {id &&
                  <TrackAlbum
                    imageUrl={images.large ? images.large.secureUrl : DEFAULT_BP_ITEM_IMAGE_URL}
                    track={trackData}
                    imageSize='medium'
                  />
                }
              </Grid.Column>
              <Grid.Column width={12}>
                <Header as='h1' className='track-title'>
                  {constructTrackLink(trackData, 'black-font')}
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
                <TrackCardActionRow canZip={canZip} numOfButtons={'three'} track={trackData} />
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
          </Grid>
        </Segment>
        <Divider />
        <Grid>
          {chartTotalPages > 0 &&
            <React.Fragment>
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
                      onPageChange={handleChartPageChange}
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
      </React.Fragment>
    </Transition>
  );

}

const mapStateToProps = state => {
  return {
    canZip: hasZippyPermission(state),
  }
}

export default connect(mapStateToProps, null)(Track);
