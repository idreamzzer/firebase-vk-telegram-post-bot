const admin = require('firebase-admin');
const functions = require('firebase-functions');
const config = require('./config');
const createBot = require('./createBot');
// const botFunction = require('./botFunction');
// const testFunction = require('./testFunction');

admin.initializeApp({
  credential: admin.credential.cert(config.googleCredentials),
});

config.functions.forEach(botConfig => {
  exports[botConfig.name] = functions.https.onRequest(createBot(botConfig));
});

// for (let func in config.functions) {
//   console.log(func);
// }

// exports.bot = functions.https.onRequest(botFunction);
// exports.test = functions.https.onRequest(testFunction);
