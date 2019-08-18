import React, { Component } from 'react';
import firebase from 'firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import ReactApexChart from 'react-apexcharts';
import { Header, Message, Grid, Divider, List, Label } from 'semantic-ui-react';

import { sortObject, deslugify } from '../utils/helpers';

class MyActivity extends Component {
  state = {
    fbRegistered: false,
    userData: {
      userDisplayName: '',
      userEmail: '',
      uid: null,
    },
    userActivityData: {
      trackPlays: {
        genresNames: {},
        genresIds: {},
        genresSortedDesc: [],
        artistsNames: {},
        artistsIds: {},
        labelsNames: {},
        labelsIds: {},
        trackIds: {},
        totalCount: 0,
      },
      trackDownloads: {
        genresNames: {},
        genresIds: {},
        genresSortedDesc: [],
        artistsNames: {},
        artistsIds: {},
        labelsNames: {},
        labelsIds: {},
        trackIds: {},
        totalCount: 0,
      }
    },
    allData: {
      trackPlaysCount: 0,
      trackDownloadsCount: 0,
    },
    pieData: {
      trackPlays: {
        genres: {
          options: {
            labels: [],
            title: {
              text: 'Tracks played by Genre',
              style: {
                fontSize: '20px',
                color: '#263238',
                align: 'center',
              },
            },
            subtitle: {
              text: 'Subtitle here',
              style: {
                fontSize: '12px',
                align: 'center',
              }
            },
            theme: {
              palette: 'palette4',
            },
            legend: {
              show: true,
              horizontalAlign: 'center',
              position: 'right',
            },
          },
          series: [],
        }
      },
      trackDownloads: {
        genres: {
          options: {
            labels: [],
            title: {
              text: 'Tracks downloaded by Genre',
              style: {
                fontSize: '20px',
                color: '#263238',
                align: 'center',
              },
            },
            theme: {
              palette: 'palette4',
            },
            legend: {
              show: true,
              horizontalAlign: 'center',
              position: 'right',
            },
          },
          series: [],
        }
      },
    }
  }

  componentDidMount() {
    const { auth } = this.props;
    if (!auth.isLoaded || (auth.isLoaded && auth.isEmpty)) return;
    const { uid } = auth;

    this.registerFbListeners(uid);
  }

  componentWillReceiveProps(nextProps) {
    const { auth } = nextProps;
    if (!auth.isLoaded || (auth.isLoaded && auth.isEmpty)) return;
    const { uid } = auth;

    const { fbRegistered } = this.state;

    if (!fbRegistered) {
      this.registerFbListeners(uid);
    }
  }

  registerFbListeners(uid) {
    const db = firebase.database();
    const userDataRef = db.ref(`users/${uid}`);
    const downloadsByGenreNameRef = db.ref(`downloads/users/${uid}/genresNames`);
    const trackPlaysByGenreNameRef = db.ref(`trackPlaysAll/users/${uid}/genresNames`);

    userDataRef.once('value', snapshot => {
      const { displayName: userDisplayName, email: userEmail } = snapshot.val();

      this.setState({
        userData: {
          userDisplayName,
          userEmail,
          uid,
        }
      })
    })

    downloadsByGenreNameRef.on('value', snapshot => {
      const genresNames = snapshot.val();
      if (!genresNames) return;

      this.setState({
        ...this.state,
        userActivityData: {
          ...this.state.userActivityData,
          trackDownloads: {
            ...this.state.userActivityData.trackDownloads,
            genresNames,
            totalCount: Object.values(genresNames).reduce((acc, val) => (acc += val), 0),
            genresSortedDesc: sortObject(genresNames, 'desc'),
          }
        }
      });

      this.refreshThePie('trackDownloads');
    })

    trackPlaysByGenreNameRef.on('value', snapshot => {
      const genresNames = snapshot.val();
      if (!genresNames) return;

      this.setState({
        ...this.state,
        userActivityData: {
          ...this.state.userActivityData,
          trackPlays: {
            ...this.state.userActivityData.trackPlays,
            genresNames,
            totalCount: Object.values(genresNames).reduce((acc, val) => (acc += val), 0),
            genresSortedDesc: sortObject(genresNames, 'desc'),
          }
        }
      });

      this.refreshThePie('trackPlays');
    })

    this.setState({ fbRegistered: true });
  }

  componentWillUnmount() {
    const { uid } = this.state.userData;

    const db = firebase.database();
    const userDataRef = db.ref(`users/${uid}`);
    const downloadsByGenreNameRef = db.ref(`downloads/users/${uid}/genresNames`);
    const trackPlaysByGenreNameRef = db.ref(`trackPlaysAll/users/${uid}/genresNames`);

    userDataRef.off('value');
    downloadsByGenreNameRef.off('value');
    trackPlaysByGenreNameRef.off('value');
  }

  refreshThePie(pieName) {
    const pieNameList = ['trackPlays', 'trackDownloads'];
    if (!pieNameList.includes(pieName)) return;

    const { userActivityData = {}, pieData = {} } = this.state;
    const { trackPlays = {}, trackDownloads = {} } = userActivityData;
    const { genresNames: trackPlaysGenreNames, totalCount: totalTrackPlayCount = 0 } = trackPlays;
    const { genresNames: trackDownloadsGenresNames, totalCount: totalTrackDownloadCount = 0 } = trackDownloads;
    const { trackPlays: pieDataTrackPlays, trackDownloads: pieDataTrackDownloads } = pieData;
    const { genres: pieDataTrackPlaysGenres } = pieDataTrackPlays;
    const { genres: pieDataTrackDownloadsGenres } = pieDataTrackDownloads;

    if (pieName === 'trackPlays') {
      const trackPlaysGenreNamesList = trackPlaysGenreNames && Object.keys(trackPlaysGenreNames);
      const trackPlaysGenreSeriesList = trackPlaysGenreNames && Object.values(trackPlaysGenreNames);

      this.setState({
        ...this.state,
        pieData: {
          ...pieData,
          trackPlays: {
            ...pieDataTrackPlays,
            genres: {
              ...pieDataTrackPlaysGenres,
              options: {
                ...pieDataTrackPlaysGenres.options,
                labels: trackPlaysGenreNamesList,
                subtitle: {
                  ...pieDataTrackPlaysGenres.subtitle,
                  text: `You've played ${totalTrackPlayCount} tracks`,
                }
              },
              series: trackPlaysGenreSeriesList,
            }
          },
        },
      });
    } else if (pieName === 'trackDownloads') {
      const trackDownloadsGenreNamesList = trackDownloadsGenresNames && Object.keys(trackDownloadsGenresNames);
      const trackDownloadsGenreSeriesList = trackDownloadsGenresNames && Object.values(trackDownloadsGenresNames);

      this.setState({
        ...this.state,
        pieData: {
          ...pieData,
          trackDownloads: {
            ...pieDataTrackDownloads,
            genres: {
              ...pieDataTrackDownloadsGenres,
              options: {
                ...pieDataTrackDownloadsGenres.options,
                labels: trackDownloadsGenreNamesList,
                subtitle: {
                  ...pieDataTrackPlaysGenres.subtitle,
                  text: `You've downloaded ${totalTrackDownloadCount} tracks`,
                }
              },
              series: trackDownloadsGenreSeriesList,
            }
          },
        },
      });
    }
  }

  render() {
    const { userActivityData = {}, pieData = {}, userData = {}, fbRegistered } = this.state;
    const { trackPlays = {}, trackDownloads = {} } = userActivityData;
    const { totalCount: totalTrackPlayCount = 0, genresSortedDesc: genresSortedDescTrackPlays = [] } = trackPlays;
    const { totalCount: totalTrackDownloadCount = 0, genresSortedDesc: genresSortedDescTrackDownloads = [] } = trackDownloads;
    const { trackPlays: pieDataTrackPlays, trackDownloads: pieDataTrackDownloads } = pieData;
    const { genres: pieDataTrackPlaysGenres } = pieDataTrackPlays;
    const { genres: pieDataTrackDownloadsGenres } = pieDataTrackDownloads;
    const { userDisplayName } = userData;

    if (!fbRegistered) {
      return (
        <Message warning>
          <Header size='huge'>Loading</Header>
          <p>Loading data...</p>
        </Message>
      )
    }

    if (totalTrackPlayCount <= 0 && totalTrackDownloadCount <= 0 && fbRegistered) {
      return (
        <Message warning>
          <Header size='huge'>No Activity!</Header>
          <p>It looks like you haven't done shit! Go play some music and come back.</p>
        </Message>
      )
    }

    return (
      <React.Fragment>
        <Header size='huge' className='tracklistHeader' textAlign='left' dividing>Activity Report - {userDisplayName}</Header>
        <Grid columns={2} stackable textAlign='center' centered>
          <Divider vertical hidden />
          <Grid.Row verticalAlign='middle' textAlign='center'>
            <Grid.Column>
              {pieDataTrackPlaysGenres.options.labels && pieDataTrackPlaysGenres.options.labels.length > 0 &&
                <ReactApexChart
                  options={pieDataTrackPlaysGenres.options}
                  series={pieDataTrackPlaysGenres.series}
                  type="donut"
                  width="550"
                  legend={{ horizontalAlign: 'center', floating: true, }}
                />
              }
            </Grid.Column>
            <Grid.Column>
              {pieDataTrackDownloadsGenres.options.labels && pieDataTrackDownloadsGenres.options.labels.length > 0 &&
                <ReactApexChart
                  options={pieDataTrackDownloadsGenres.options}
                  series={pieDataTrackDownloadsGenres.series}
                  type="donut"
                  width="550"
                  legend={{ horizontalAlign: 'center', floating: true, }}
                />
              }
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid columns={2} stackable textAlign='center' centered>
          <Divider vertical hidden />
          <Grid.Row verticalAlign='top' textAlign='center'>
            <Grid.Column>
              <List selection verticalAlign='top'>
                {genresSortedDescTrackPlays.length > 0 &&
                  genresSortedDescTrackPlays.map(genre => {
                    return (
                      <List.Item key={genre.key}>
                        <List.Content floated='left'>
                          <List.Header>
                            {deslugify(genre.key).toUpperCase()}
                          </List.Header>
                        </List.Content>
                        <List.Content floated='right'>
                          <Label circular color='grey'>{genre.value} play{+genre.value > 1 && 's'}</Label>
                        </List.Content>
                      </List.Item>
                    )
                  })
                }
              </List>
            </Grid.Column>
            <Grid.Column>
              <List selection verticalAlign='top'>
                {genresSortedDescTrackDownloads.length > 0 &&
                  genresSortedDescTrackDownloads.map(genre => {
                    return (
                      <List.Item key={genre.key}>
                        <List.Content floated='left'>
                          <List.Header>
                            {deslugify(genre.key).toUpperCase()}
                          </List.Header>
                        </List.Content>
                        <List.Content floated='right'>
                          <Label circular color='grey'>{genre.value} download{+genre.value > 1 && 's'}</Label>
                        </List.Content>
                      </List.Item>
                    )
                  })
                }
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
}

export default compose(
  firebaseConnect(),
  connect(({ firebaseState: { auth } }) => ({ auth }))
)(MyActivity);
