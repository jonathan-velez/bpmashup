import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';

import { registerFirebaseListeners } from '../utils/storeUtils';
import SplashPage from './SplashPage';

/*
- If firebase auth hasn't been loaded, show splash page, otherwise render the rest of the app
- Register firebase listeners for user once logged in and uid changes
- Unsubscribe firebase listeners on when user logs out
*/
const AuthIsLoaded = ({ children, auth }) => {
  const loaded = isLoaded(auth);
  const { uid } = auth;

  useEffect(() => {
    let unsubscribeFns = [];

    const doStuff = async () => {
      const listeners = await registerFirebaseListeners();
      unsubscribeFns = listeners && [...listeners];
    };

    if (uid) {
      doStuff();
    }

    return () => {
      unsubscribeFns.forEach((fn) => fn());
    };
  }, [uid]);

  if (!loaded) return <SplashPage />;
  return children;
};

const mapStateToProps = (state) => {
  return {
    auth: state.firebaseState.auth,
  };
};

export default connect(
  mapStateToProps,
  null,
)(AuthIsLoaded);
