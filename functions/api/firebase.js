const admin = require("firebase-admin");
const config = require("../config");
admin.initializeApp({
  credential: admin.credential.cert(config.googleCredentials)
});
const db = admin.firestore();

module.exports = { db };
