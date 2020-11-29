const admin = require('firebase-admin');
const firestore = admin.firestore();

const logToFirestore = (payload) => {
  if (!payload || !payload.type) {
    return console.error(
      `Error logging to Firestore. Invalid payload or mmissing 'type' attribute`,
    );
  }

  const logCollection = firestore.collection('logs');

  logCollection
    .add({
      ...payload,
      dateAdded: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then((docRef) => {
      console.log('Log written with ID: ', docRef.id);
    });
};

exports.logToFirestore = logToFirestore;
