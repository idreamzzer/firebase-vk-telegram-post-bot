const admin = require('firebase-admin');
const functions = require('firebase-functions');
const config = require('./config');
const createBot = require('./createBot');

admin.initializeApp({
  credential: admin.credential.cert(config.googleCredentials),
});

config.functions.forEach(botConfig => {
  exports[botConfig.name] = functions.https.onRequest(createBot(botConfig));
});
