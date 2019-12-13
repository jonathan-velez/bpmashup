import React from 'react';
import { connect } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';

import { registerFirebaseListeners } from '../utils/storeUtils';

const AuthIsLoaded = ({ children, auth }) => {
  if (!isLoaded(auth)) return <div>splash screen...</div>;
  registerFirebaseListeners();
  return children;
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebaseState.auth,
  }
}

export default connect(mapStateToProps, null)(AuthIsLoaded);
