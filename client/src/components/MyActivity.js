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
      genres: {
        options: {
          labels: [],
          title: {
            text: 'GENRES',
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
            horizontalAlign: 'left',
            position: 'bottom',
          },
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        },
        series: [],
      }
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
        this.setState({
          ...this.state,
          userActivityData: {
            trackDownloads: snapshot.val(),
          }
        })
        this.refreshThePie();
      })

      trackPlaysUserRef.on('value', snapshot => {
        console.log('trackPlaysUserRef updated');
        const userTrackData = snapshot.val();
        // eslint-disable-next-line no-unused-vars
        const { tracks, ...rest } = userTrackData;

        this.setState({
          ...this.state,
          userActivityData: {
            trackPlays: {
              ...rest,
            }
          }
        });

        this.refreshThePie();
      })
    }
  }

  refreshThePie() {
    console.log('refreshing the pie');
    const { userActivityData = {}, pieData = {} } = this.state;
    const { trackPlays = {} } = userActivityData;
    const { genresNames } = trackPlays;
    const { genres: pieDataGenres } = pieData;

    const genreNamesList = genresNames && Object.keys(genresNames);
    const genreSeriesList = genresNames && Object.values(genresNames);

    this.setState({
      ...this.state,
      pieData: {
        ...pieData,
        genres: {
          ...pieDataGenres,
          options: {
            ...pieDataGenres.options,
            labels: genreNamesList,
          },
          series: genreSeriesList,
        }
      },
    })
  }

  render() {
    const { userActivityData = {}, pieData = {}, userData = {} } = this.state;
    const { trackPlays = {} } = userActivityData;
    const { totalCount: totalTrackPlayCount = 0 } = trackPlays;
    const { genres: pieDataGenres } = pieData;
    const { userDisplayName } = userData;

    if (totalTrackPlayCount <= 0) return null; //TODO: display something nicer here

    return (
      <React.Fragment>
        <h1>My Activity - {userDisplayName}</h1>
        <div>{totalTrackPlayCount > 0 && `You've played ${totalTrackPlayCount} tracks`}</div>

        {pieDataGenres.options.labels && pieDataGenres.options.labels.length > 0 &&
          <ReactApexChart
            options={pieDataGenres.options}
            series={pieDataGenres.series}
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
