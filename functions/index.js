const functions = require("firebase-functions");
const config = require("./config");
const createBot = require("./createBot");
const cleanEvents = require('./cleanEvents');

config.bots.forEach(botName => {
  exports[botName] = functions.region(config.functionsRegion).https.onRequest(createBot(botName));
});

exports.cleanEvents = functions.pubsub.schedule(config.cleanSchedule).onRun(cleanEvents);