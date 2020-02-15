const functions = require("firebase-functions");
const config = require("./config");
const createBot = require("./createBot");

config.bots.forEach(botName => {
  exports[botName] = functions.https.onRequest(createBot(botName));
});
