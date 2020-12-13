import React from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import TrackListingController from './TrackListingController';
import PlaylistController from './PlaylistController';
import MyLovedLabels from './MyLovedLabels';
import SearchResultsController from './SearchResultsController';
import Release from './Release';
import Artist from './Artist';
import Label from './Label';
import TracksRoute from './TracksRoute';
import MyLovedTracks from './MyLovedTracks';
import MyActivity from './MyActivity';
import Track from './Track';
import Chart from './Chart';
import MyProfile from './MyProfile';
import DownloadQueuePage from './DownloadQueuePage';
import Home from './Home';
import Genre from './Genre';
import Preferences from './Preferences';
import ProtectedRoute from './ProtectedRoute';
import PageNotFound from './PageNotFound';
import Charts from './Charts';
import { DEFAULT_PAGE_TITLE } from '../constants/defaults';

const Main = () => {
  const containerStyle = {
    marginTop: '7em',
    marginBottom: '8em',
    paddingBottom: '8em',
  };
  return (
    <Container style={containerStyle} textAlign='center'>
      <Helmet>
        <title>{DEFAULT_PAGE_TITLE}</title>
      </Helmet>
      <Switch>
        <Route exact path='/charts/all' component={Charts} />
        <Route exact path='/chart/:chartName/:chartId' component={Chart} />
        <Route exact path='/track/:trackName/:trackId' component={Track} />
        <ProtectedRoute
          exact
          path='/history/my-activity'
          component={MyActivity}
        />
        <ProtectedRoute
          exact
          path='/history/loved-labels'
          component={MyLovedLabels}
        />
        <ProtectedRoute
          exact
          path='/history/loved-tracks'
          component={MyLovedTracks}
        />
        <Route exact path='/artist/:artistName/:artistId' component={Artist} />
        <Route exact path='/label/:labelName/:labelId' component={Label} />
        <Route
          exact
          path='/most-popular/:type/:searchString/:searchId'
          component={TrackListingController}
        />
        <Route
          exact
          path='/similar-tracks/:trackName/:trackId'
          component={TrackListingController}
        />
        <Route
          exact
          path='/playlist/:playlistName/:playlistId'
          component={PlaylistController}
        />
        <Route
          exact
          path='/search/:searchTerm'
          component={SearchResultsController}
        />
        <Route
          exact
          path='/release/:releaseName/:releaseId'
          component={Release}
        />
        <Route exact path='/tracks' component={TracksRoute} />
        <Route
          exact
          path='/:itemType/:itemName/:itemId/tracks'
          component={TracksRoute}
        />
        <Route exact path='/genre/:genreName/:genreId' component={Genre} />
        <ProtectedRoute exact path='/my-profile' component={MyProfile} />
        <ProtectedRoute exact path='/preferences' component={Preferences} />
        <ProtectedRoute
          exact
          path='/download-queue'
          component={DownloadQueuePage}
        />
        <Route exact path='/' component={Home} />
        <Route component={PageNotFound} />
      </Switch>
    </Container>
  );
};

export default withRouter(Main);
