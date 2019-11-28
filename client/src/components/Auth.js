import React, { Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { firebaseConnect } from 'react-redux-firebase';
import { Image, Icon, Dropdown } from 'semantic-ui-react';

import store from '../store';
import {
  openLoginModalWindow,
  clearPlaylists,
  clearDownloads,
  clearNoDownloads,
  clearLovedTracks,
  clearLovedArtists,
  clearLovedArtistsDetails,
  clearLovedLabels,
  clearLovedLabelsDetails,
} from '../actions/ActionCreators';

// TODO: Dispatch through actions/thunks rather than importing store
const Auth = ({ auth, firebase, history }) => {
  const logIn = () => {
    store.dispatch(openLoginModalWindow());
  }

  const logOut = () => {
    firebase.logout().then(() => {
      store.dispatch(clearPlaylists());
      store.dispatch(clearDownloads());
      store.dispatch(clearNoDownloads());
      store.dispatch(clearLovedTracks());
      store.dispatch(clearLovedArtists());
      store.dispatch(clearLovedArtistsDetails());
      store.dispatch(clearLovedLabels());
      store.dispatch(clearLovedLabelsDetails());
      history.push(`/`);
    });
  }

  const { photoURL, displayName, email } = auth;

  const trigger = auth.isEmpty ?
    <Icon name='user outline' />
    :
    photoURL ?
      <Image
        src={photoURL}
        size='mini'
        circular
      />
      :
      <Icon name='user' />

  return (
    <Fragment>
      <Dropdown
        item
        scrolling
        trigger={trigger}
        direction='left'
      >
        <Dropdown.Menu>
          {!auth.isEmpty ?
            <Fragment>
              <Dropdown.Item
                disabled
                text={displayName ? displayName.toUpperCase() : email}
              />
              <Dropdown.Item
                as={Link} to='/history/loved-tracks'
                text='Loved Tracks'
              />
              <Dropdown.Item
                as={Link} to='/history/loved-labels'
                text='Loved Labels'
              />
              <Dropdown.Item
                as={Link} to='/history/downloads'
                text='Downloads'
              />
              <Dropdown.Item
                as={Link} to='/history/no-downloads'
                text='No Downloads'
              />
              <Dropdown.Item
                as={Link} to='/history/my-activity'
                text='My Activity'
              />
              <Dropdown.Divider />
              <Dropdown.Item
                text='Log out'
                onClick={() => logOut()}
              />
            </Fragment>
            :
            <Fragment>
              <Dropdown.Item
                text='Log in / Sign up'
                onClick={() => logIn()}
              />
            </Fragment>
          }
        </Dropdown.Menu>
      </Dropdown>
    </Fragment>
  );
}

export default compose(
  firebaseConnect(),
  connect(({ firebaseState: { auth } }) => ({ auth }))
)(withRouter(Auth));
