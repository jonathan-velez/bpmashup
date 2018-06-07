import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { Image, Icon, Menu } from 'semantic-ui-react';

import store from '../store';
import { CLEAR_PLAYLISTS } from '../constants/actionTypes';
import * as thunks from '../thunks/';

const Auth = ({ firebase, auth }) => {
  const { photoURL } = auth;

  const logIn = () => {
    firebase.login({ provider: 'google', type: 'popup' }).then(val => {
      store.dispatch(thunks.loadPlaylists());
    });
  }

  const logOut = () => {
    firebase.logout().then(val => {
      store.dispatch({
        type: CLEAR_PLAYLISTS
      });
    });
  }

  const logOutButton = (
    <React.Fragment>
      <Menu.Item
        position='right'
        link
        onClick={() => logOut()}
      >
        <Image
          src={photoURL}
          size='mini'
          circular
        />&nbsp;
        <span>Log out</span>
        <Icon
          name='sign out'
          size='large'
        />
      </Menu.Item >
    </React.Fragment>
  );

  const logInButton = (
    <Menu.Item
      position='right'
      link
      onClick={() => logIn()}
    >
      <span>Log in</span>
      <Icon
        name='sign in'
        size='large'
      />
    </Menu.Item >
  );

  return (
    <React.Fragment>{auth.isEmpty ? logInButton : logOutButton}</React.Fragment>
  );
};

export default compose(
  firebaseConnect(),
  connect(({ firebaseState: { auth } }) => ({ auth }))
)(Auth);