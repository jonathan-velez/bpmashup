import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import TrackListingController from './TrackListingController';
import PlaylistController from './PlaylistController';
import MyLovedLabels from './MyLovedLabels';
import SearchResultsController from './SearchResultsController';
import ReleaseListingController from './ReleaseListingController';
import Artist from './Artist';
import Label from './Label';
import TracksController from './TracksController';
import MyHistoryTracksController from './MyHistoryTracksController';
import MyActivity from './MyActivity';
import Track from './Track';
import Chart from './Chart';
import MyProfile from './MyProfile';
import DownloadQueuePage from './DownloadQueuePage';
import Home from './Home';

const Main = () => {
  const containerStyle = {
    marginTop: '7em',
    marginBottom: '8em',
  };
  return (
    <Container style={containerStyle} textAlign='center'>
      <Switch>
        <Route exact path='/chart/:chartName/:chartId' component={Chart} />
        <Route exact path='/track/:trackName/:trackId' component={Track} />
        <Route exact path='/history/my-activity' component={MyActivity} />
        <Route exact path='/history/loved-labels' component={MyLovedLabels} />
        <Route
          exact
          path='/history/:pageType'
          component={MyHistoryTracksController}
        />
        <Route
          exact
          path='/artist/:artistName/:artistId'
          component={Artist}
        />
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
          component={ReleaseListingController}
        />
        <Route exact path='/tracks' component={TracksController} />
        <Route
          exact
          path='/:itemType/:itemName/:itemId/tracks'
          component={TracksController}
        />
        <Route exact path='/my-profile' component={MyProfile} />
        <Route exact path='/download-queue' component={DownloadQueuePage} />
        <Route exact path='/' component={Home} />
      </Switch>
    </Container>
  );
};

export default withRouter(Main);
