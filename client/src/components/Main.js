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
import MyDownloadsAndLovedTracks from './MyDownloadsAndLovedTracks';

const Main = () => {
  const containerStyle = {
    marginTop: '7em',
    marginBottom: '8em'
  };
  return (
    <Container style={containerStyle} textAlign='center'>
      <Switch>
        <Route exact path='/history/loved-labels' component={MyLovedLabels} />
        <Route exact path='/history/:pageType' component={MyDownloadsAndLovedTracks} />
        <Route exact path='/artist/:artistName/:artistId' component={Artist} />
        <Route exact path='/label/:labelName/:labelId' component={Label} />
        <Route exact path="/most-popular/:type/:searchString/:searchId" component={TrackListingController} />
        <Route exact path="/similar-tracks/:trackName/:trackId" component={TrackListingController} />
        <Route exact path="/playlist/:playlistName/:playlistId" component={PlaylistController} />
        <Route exact path="/search/:searchTerm" component={SearchResultsController} />
        <Route exact path="/release/:releaseName/:releaseId" component={ReleaseListingController} />
        <Route exact path="/tracks" component={TracksController} />
        <Route exact path='/:itemType/:itemName/:itemId/tracks' component={TracksController} />
        <Route exact path="/" component={TrackListingController} />
      </Switch>
    </Container>
  )
}

export default withRouter(Main);
