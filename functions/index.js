const functions = require("firebase-functions");
const config = require("./config");
const createBot = require("./createBot");
const cleanEvents = require("./cleanEvents");

config.bots.forEach((bot) => {
  exports[bot.name] = functions
    .region(config.functionsRegion)
    .https.onRequest(createBot(bot));
});

exports.cleanEvents = functions.pubsub
  .schedule(config.cleanSchedule)
  .onRun(cleanEvents);
