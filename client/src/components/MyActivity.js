import React, { Component } from 'react';
import firebase from 'firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import ReactApexChart from 'react-apexcharts';
import { Header, Message, Grid, Divider } from 'semantic-ui-react';

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

    const downloadsUserRef = db.ref(`downloads/users/${uid}`);
    const trackPlaysUserRef = db.ref(`trackPlaysAll/users/${uid}`);
    const userDataRef = db.ref(`users/${uid}`);

    // const downloadsAllCountRef = db.ref(`downloads/totalCount`);
    // const trackPlaysCountRef = db.ref(`trackPlaysAll/totalCount`);

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

    downloadsUserRef.on('value', snapshot => {
      const userTrackData = snapshot.val();
      // eslint-disable-next-line no-unused-vars
      const { tracks, ...rest } = userTrackData;

      this.setState({
        ...this.state,
        userActivityData: {
          ...this.state.userActivityData,
          trackDownloads: {
            ...rest,
          }
        }
      })
      this.refreshThePie('trackDownloads');
    })

    trackPlaysUserRef.on('value', snapshot => {
      const userTrackData = snapshot.val();
      // eslint-disable-next-line no-unused-vars
      const { tracks, ...rest } = userTrackData;

      this.setState({
        ...this.state,
        userActivityData: {
          ...this.state.userActivityData,
          trackPlays: {
            ...rest,
          },
        }
      });

      this.refreshThePie('trackPlays');
    })

    this.setState({ fbRegistered: true });
  }

  componentWillUnmount() {
    const { uid } = this.state.userData;

    const db = firebase.database();
    const downloadsUserRef = db.ref(`downloads/users/${uid}`);
    const trackPlaysUserRef = db.ref(`trackPlaysAll/users/${uid}`);
    const userDataRef = trackPlaysUserRef.child('userData');

    downloadsUserRef.off('value');
    trackPlaysUserRef.off('value');
    userDataRef.off('value');
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
    const { totalCount: totalTrackPlayCount = 0 } = trackPlays;
    const { totalCount: totalTrackDownloadCount = 0 } = trackDownloads;
    const { trackPlays: pieDataTrackPlays, trackDownloads: pieDataTrackDownloads } = pieData;
    const { genres: pieDataTrackPlaysGenres } = pieDataTrackPlays;
    const { genres: pieDataTrackDownloadsGenres } = pieDataTrackDownloads;
    const { userDisplayName } = userData;

    if (!fbRegistered) {
      return(
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

      </React.Fragment>
    );
  }
}

export default compose(
  firebaseConnect(),
  connect(({ firebaseState: { auth } }) => ({ auth }))
)(MyActivity);
