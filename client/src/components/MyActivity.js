import React, { Component } from 'react';
import firebase from 'firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import ReactApexChart from 'react-apexcharts';

class MyActivity extends Component {
  state = {
    userData: {
      userDisplayName: '',
      userEmail: '',
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
                fontSize: '28px',
                color: '#263238'
              },
            },
            theme: {
              // monochrome: {
              //   enabled: true
              // }
              // mode: 'dark',
              palette: 'palette4',
            },
            legend: {
              show: true,
              horizontalAlign: 'center',
              position: 'bottom',
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
              text: 'Tracks played by Genre',
              style: {
                fontSize: '28px',
                color: '#263238'
              },
            },
            theme: {
              // monochrome: {
              //   enabled: true
              // }
              // mode: 'dark',
              palette: 'palette4',
            },
            legend: {
              show: true,
              horizontalAlign: 'center',
              position: 'bottom',
            },
          },
          series: [],
        }
      },
    }
  }

  componentDidMount() {
    console.log('auth', this.props.auth)
  }

  componentWillReceiveProps(nextProps) {
    const { auth } = nextProps;
    if (!auth.isLoaded || (auth.isLoaded && auth.isEmpty)) return;
    const { uid } = auth;

    const { userActivityData = {} } = this.state;
    const { trackPlays = {} } = userActivityData;
    const { totalCount } = trackPlays;

    if (totalCount > 0) {
      this.refreshThePie();
    } else {
      const db = firebase.database();

      const downloadsUserRef = db.ref(`downloads/users/${uid}`);
      const downloadsAllCountRef = db.ref(`downloads/totalCount`);

      const trackPlaysUserRef = db.ref(`trackPlaysAll/users/${uid}`);
      const trackPlaysCountRef = db.ref(`trackPlaysAll/totalCount`);

      const userDataRef = trackPlaysUserRef.child('userData');
      userDataRef.once('value', snapshot => {
        const { userDisplayName, userEmail } = snapshot.val();

        this.setState({
          userData: {
            userDisplayName,
            userEmail,
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
    }
  }

  refreshThePie(pieName) {
    const pieNameList = ['trackPlays', 'trackDownloads'];
    if (!pieNameList.includes(pieName)) return;

    console.log('refreshing the pie');
    const { userActivityData = {}, pieData = {} } = this.state;
    const { trackPlays = {}, trackDownloads = {} } = userActivityData;
    const { genresNames: trackPlaysGenreNames } = trackPlays;
    const { genreNames: trackDownloadsGenresNames } = trackDownloads;
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
              },
              series: trackDownloadsGenreSeriesList,
            }
          },
        },
      });
    }
  }

  render() {
    const { userActivityData = {}, pieData = {}, userData = {} } = this.state;
    const { trackPlays = {} } = userActivityData;
    const { totalCount: totalTrackPlayCount = 0 } = trackPlays;
    const { trackPlays: pieDataTrackPlays } = pieData;
    const { genres: pieDataTrackPlaysGenres } = pieDataTrackPlays;
    const { userDisplayName } = userData;

    if (totalTrackPlayCount <= 0) return null; //TODO: display something nicer here

    return (
      <React.Fragment>
        <h1>My Activity - {userDisplayName}</h1>
        <div>{totalTrackPlayCount > 0 && `You've played ${totalTrackPlayCount} tracks`}</div>

        {pieDataTrackPlaysGenres.options.labels && pieDataTrackPlaysGenres.options.labels.length > 0 &&
          <ReactApexChart
            options={pieDataTrackPlaysGenres.options}
            series={pieDataTrackPlaysGenres.series}
            type="pie"
            width="600"
            legend={{ horizontalAlign: 'right' }}
          />
        }
      </React.Fragment>
    );
  }
}

export default compose(
  firebaseConnect(),
  connect(({ firebaseState: { auth } }) => ({ auth }))
)(MyActivity);
