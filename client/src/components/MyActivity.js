import React, { useEffect, useReducer } from 'react';
import firebase from 'firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import ReactApexChart from 'react-apexcharts';
import { Header, Message, Grid, Divider, List, Label } from 'semantic-ui-react';

import { sortObject, deslugify } from '../utils/helpers';

const MyActivity = ({ auth }) => {
  const initialState = {
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

  const reducer = (state, action) => {
    switch (action.type) {
      case 'set_user_data': {
        const { userDisplayName, userEmail, uid } = action.payload;

        return {
          ...state,
          userData: {
            userDisplayName,
            userEmail,
            uid,
          }
        }
      }
      case 'load_genre_activity_data': {
        const { activityType, genresNames } = action.payload;
        const totalCount = Object.values(genresNames).reduce((acc, val) => (acc += val), 0);

        if (!['trackPlays', 'trackDownloads'].includes(activityType)) {
          return state;
        }

        return {
          ...state,
          userActivityData: {
            ...state.userActivityData,
            [activityType]: {
              ...state.userActivityData[activityType],
              genresNames,
              totalCount,
              genresSortedDesc: sortObject(genresNames, 'desc'),
            }
          },
          pieData: {
            ...state.pieData,
            [activityType]: {
              ...state.pieData[activityType],
              genres: {
                ...state.pieData[activityType].genres,
                options: {
                  ...state.pieData[activityType].genres.options,
                  labels: Object.keys(genresNames),
                  subtitle: {
                    text: `You've played ${totalCount} tracks`,
                  }
                },
                series: Object.values(genresNames)
              }
            }
          }
        }
      }
      case 'set_fb_registered': {
        return {
          ...state,
          fbRegistered: true,
        }
      }
      default: {
        return state;
      }
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const db = firebase.database();

  useEffect(() => {
    const { uid } = auth;
    const { fbRegistered } = state;

    if (!fbRegistered && uid) {
      registerFbListeners(uid);
    }

    return (() => unregisterFbListeners());
  }, [auth.isLoaded]);

  const registerFbListeners = (uid) => {
    if (!uid) return;

    const db = firebase.database();
    const userDataRef = db.ref(`users/${uid}`);
    const downloadsByGenreNameRef = db.ref(`downloads/users/${uid}/genresNames`);
    const trackPlaysByGenreNameRef = db.ref(`trackPlaysAll/users/${uid}/genresNames`);

    userDataRef.once('value', snapshot => {
      const { displayName: userDisplayName, email: userEmail } = snapshot.val();

      dispatch({
        type: 'set_user_data',
        payload: {
          userDisplayName,
          userEmail,
          uid,
        }
      });
    })

    downloadsByGenreNameRef.on('value', snapshot => {
      const genresNames = snapshot.val();
      if (!genresNames) return;

      dispatch({
        type: 'load_genre_activity_data',
        payload: {
          activityType: 'trackDownloads',
          genresNames,
        }
      });
    });

    trackPlaysByGenreNameRef.on('value', snapshot => {
      const genresNames = snapshot.val();
      if (!genresNames) return;

      dispatch({
        type: 'load_genre_activity_data',
        payload: {
          activityType: 'trackPlays',
          genresNames,
        }
      });
    });

    dispatch({
      type: 'set_fb_registered',
    });
  }

  const unregisterFbListeners = () => {
    const { uid } = state.userData;

    const userDataRef = db.ref(`users/${uid}`);
    const downloadsByGenreNameRef = db.ref(`downloads/users/${uid}/genresNames`);
    const trackPlaysByGenreNameRef = db.ref(`trackPlaysAll/users/${uid}/genresNames`);

    userDataRef.off('value');
    downloadsByGenreNameRef.off('value');
    trackPlaysByGenreNameRef.off('value');
  }

  const { userActivityData = {}, pieData = {}, userData = {}, fbRegistered } = state;
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

export default compose(
  firebaseConnect(),
  connect(({ firebaseState: { auth } }) => ({ auth }))
)(MyActivity);
