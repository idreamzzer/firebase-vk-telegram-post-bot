const admin = require('firebase-admin');
const functions = require('firebase-functions');
const config = require('./config');
const botFunction = require('./botFunction');
const testFunction = require('./testFunction');

admin.initializeApp({
  credential: admin.credential.cert(config.googleCredentials),
});

exports.bot = functions.https.onRequest(botFunction);
exports.test = functions.https.onRequest(testFunction);
