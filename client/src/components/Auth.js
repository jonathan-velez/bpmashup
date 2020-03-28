import React, { Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { firebaseConnect } from 'react-redux-firebase';
import { Icon, Dropdown } from 'semantic-ui-react';

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
import ConfirmAction from './ConfirmAction';
import UserAvatar from './UserAvatar';

// TODO: Dispatch through actions/thunks rather than importing store
// TODO: Extract avatar into own component, register listener so image updates are detected, use selector to get image
const Auth = ({ auth, profile, firebase, history }) => {
  const logIn = () => {
    store.dispatch(openLoginModalWindow());
  };

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
  };

  const { email } = auth;
  const { displayName, photoURL } = profile;

  const trigger = auth.isEmpty ? (
    <Icon name='user outline' />
  ) : photoURL ? (
    <UserAvatar />
  ) : (
    <Icon name='user' />
  );

  return (
    <Fragment>
      <Dropdown item scrolling trigger={trigger} direction='left'>
        <Dropdown.Menu>
          {!auth.isEmpty ? (
            <Fragment>
              <Dropdown.Item
                disabled
                text={displayName ? displayName.toUpperCase() : email}
              />
              <Dropdown.Item
                as={Link}
                to='/download-queue'
                text='Download Queue'
              />
              <Dropdown.Item
                as={Link}
                to='/history/loved-tracks'
                text='Loved Tracks'
              />
              <Dropdown.Item
                as={Link}
                to='/history/loved-labels'
                text='Loved Labels'
              />
              <Dropdown.Item
                as={Link}
                to='/history/downloads'
                text='Download History'
              />
              <Dropdown.Item
                as={Link}
                to='/history/no-downloads'
                text='No Downloads History'
              />
              <Dropdown.Item
                as={Link}
                to='/history/my-activity'
                text='My Activity'
              />
              <Dropdown.Item as={Link} to='/my-profile' text='My Profile' />
              <Dropdown.Divider />
              <ConfirmAction
                action={logOut}
                confirmText='Log out?'
                render={(openConfirm) => {
                  return <Dropdown.Item text='Log out' onClick={openConfirm} />;
                }}
              />
            </Fragment>
          ) : (
            <Fragment>
              <Dropdown.Item text='Log in / Sign up' onClick={() => logIn()} />
            </Fragment>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </Fragment>
  );
};

export default compose(
  firebaseConnect(),
  connect(({ firebaseState: { auth, profile } }) => ({ auth, profile })),
)(withRouter(Auth));
