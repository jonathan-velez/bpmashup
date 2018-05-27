import { createStore, applyMiddleware, compose } from 'redux';
import ReduxPromise from 'redux-promise';
import { syncHistoryWithStore } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import firebase from 'firebase';
import thunk from 'redux-thunk';
import logger from 'redux-logger'

import rootReducer from './reducers/index';
import { loadStorage, setStorage } from './localStorage';
import { activityLogger } from './middleware';

const persistedStorage = loadStorage();

const firebaseConfig = {
  apiKey: "AIzaSyB64LWcBgz5xhtwii5LQDRlfBFivZk6GOU",
  authDomain: "bp-mashup.firebaseapp.com",
  databaseURL: "https://bp-mashup.firebaseio.com",
  projectId: "bp-mashup",
  storageBucket: "",
  messagingSenderId: "683438091005"
};

const rrfConfig = {
  userProfile: 'users',
  attachAuthIsReady: true,
  firebaseStateName: 'firebaseState',
}

firebase.initializeApp(firebaseConfig);

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig),
  applyMiddleware(ReduxPromise, thunk, logger, activityLogger)
)(createStore);

const store = createStoreWithFirebase(rootReducer, persistedStorage);

store.subscribe(() => {
  setStorage(store.getState());
});

store.firebaseAuthIsReady.then(() => {
  console.log('auth is loaded')
})

export const history = syncHistoryWithStore(createBrowserHistory(), store);

export default store;