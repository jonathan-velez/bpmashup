import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import TrackListingController from './TrackListingController';
import PlaylistController from './PlaylistController';
import About from './About';

const Main = () => {
  const containerStyle = {
    marginTop: '5em',
    marginBottom: '8em'
  };
  return (
    <Container style={containerStyle} textAlign='center'>
      <Switch>
        <Route exact path='/about' component={About} />
        <Route exact path="/most-popular/:type/:searchString/:searchId" component={TrackListingController} />
        <Route exact path="/playlist/:playlistId" component={PlaylistController} />
        <Route path="/search/:searchTerm" component={TrackListingController} />
        <Route exact path="/" component={TrackListingController} />
      </Switch>
    </Container>
  )
}

export default withRouter(Main);