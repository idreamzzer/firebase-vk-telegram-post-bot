const admin = require("firebase-admin");
const functions = require("firebase-functions");
const config = require("./config");
const createBot = require("./createBot");

admin.initializeApp({
  credential: admin.credential.cert(config.googleCredentials)
});
const db = admin.firestore();

config.bots.forEach(botName => {
  exports[botName] = functions.https.onRequest(createBot(botName, db));
});
