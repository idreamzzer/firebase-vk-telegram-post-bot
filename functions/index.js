const functions = require("firebase-functions");
const config = require("./config");
const createBot = require("./createBot");
const cleanPostsId = require("./cleanPostsId");

config.bots.forEach((bot) => {
  exports[bot.name] = functions
    .region(config.functionsRegion)
    .https.onRequest(createBot(bot));
});

exports.cleanPostsId = functions.pubsub
  .schedule(config.cleanSchedule)
  .onRun(cleanPostsId);
