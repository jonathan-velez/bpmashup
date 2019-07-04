const firebase = require('firebase');

const { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_DB_URL, FIREBASE_PROJECT_ID, FIREBASE_MESSAGING_ID } = process.env;

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DB_URL,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: "",
  messagingSenderId: FIREBASE_MESSAGING_ID,
};

const getFirebaseInstance = () => {
  return firebase.initializeApp(firebaseConfig);
}

exports.firebaseInstance = getFirebaseInstance
