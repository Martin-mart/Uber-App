const admin = require('firebase-admin');

// Replace with your service account JSON file
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<YOUR_PROJECT_ID>.firebaseio.com"
});

// Replace with the UID of the user you want to make admin
const uid = "<USER_UID>";

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`Custom claim 'admin' set for user ${uid}`);
    process.exit();
  })
  .catch((error) => {
    console.error("Error setting custom claim:", error);
    process.exit(1);
  });
