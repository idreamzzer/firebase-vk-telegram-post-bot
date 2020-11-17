const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(config.googleCredentials),
});
const db = admin.firestore();

module.exports = { db };
