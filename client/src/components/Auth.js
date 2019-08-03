import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { firebaseConnect } from 'react-redux-firebase';
import { Image, Icon, Dropdown } from 'semantic-ui-react';

import store from '../store';
import { clearPlaylists, openLoginModalWindow } from '../actions/ActionCreators';

class Auth extends React.Component {
  logIn = () => {
    store.dispatch(openLoginModalWindow());
  }

  logOut = () => {
    this.props.firebase.logout().then(() => {
      store.dispatch(clearPlaylists());
    });
  }

  render() {
    const { auth } = this.props;
    const { photoURL, displayName } = auth;

    const trigger = auth.isEmpty ?
      <Icon name='user outline' />
      :
      <Image
        src={photoURL}
        size='mini'
        circular
      />

    return (
      <React.Fragment>
        <Dropdown
          item
          scrolling
          trigger={trigger}
          direction='left'
        >
          <Dropdown.Menu>
            {!auth.isEmpty ?
              <React.Fragment>
                <Dropdown.Item
                  disabled
                  text={displayName && displayName.toUpperCase()}
                />
                <Dropdown.Item
                  as={Link} to='/my-downloads'
                  text='My Downloads'
                />
                <Dropdown.Divider />
                <Dropdown.Item
                  text='Log out'
                  onClick={() => this.logOut()}
                />
              </React.Fragment>
              :
              <React.Fragment>
                <Dropdown.Item
                  text='Log in'
                  onClick={() => this.logIn()}
                />
              </React.Fragment>
            }
          </Dropdown.Menu>
        </Dropdown>
      </React.Fragment>
    );
  }
}

export default compose(
  firebaseConnect(),
  connect(({ firebaseState: { auth } }) => ({ auth }))
)(Auth);
