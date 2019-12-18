import React from 'react';
import { connect } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';

import { registerFirebaseListeners } from '../utils/storeUtils';
import SplashPage from './SplashPage';

const AuthIsLoaded = ({ children, auth }) => {
  if (!isLoaded(auth)) return <SplashPage />
  registerFirebaseListeners();
  return children;
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebaseState.auth,
  }
}

export default connect(mapStateToProps, null)(AuthIsLoaded);
