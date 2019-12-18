import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import { Provider } from 'react-redux';

import AppWrapper from './components/AppWrapper';
import AuthIsLoaded from './components/AuthIsLoaded';
import store from './store';

const firebaseConfig = {
  apiKey: "AIzaSyB64LWcBgz5xhtwii5LQDRlfBFivZk6GOU",
  authDomain: "bp-mashup.firebaseapp.com",
  databaseURL: "https://bp-mashup.firebaseio.com",
  projectId: "bp-mashup",
  storageBucket: "gs://bp-mashup.appspot.com",
  messagingSenderId: "683438091005"
};

const rrfConfig = {
  userProfile: 'users',
  attachAuthIsReady: true,
  firebaseStateName: 'firebaseState',
}

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
}

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <AuthIsLoaded>
        <AppWrapper />
      </AuthIsLoaded>
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById('root')
);
