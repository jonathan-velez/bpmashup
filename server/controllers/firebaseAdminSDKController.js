const admin = require('firebase-admin');
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_CONFIG, 'base64').toString(),
);

exports.firebaseInstance = () => {
  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://bpmashup-firestore.firebaseio.com',
  });
};
