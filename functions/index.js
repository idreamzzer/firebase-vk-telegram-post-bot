const functions = require("firebase-functions");
const config = require("./config");
const handleNewPost = require("./handleNewPost");
// const createBot = require("./createBot");
// const cleanPostsId = require("./cleanPostsId");

// const express = require("express");
// const cors = require("cors");
// const { debug, info, error, warn } = require("firebase-functions/lib/logger");
// const { isAuthenticated } = require("./utils");
// const { forwardPost } = require("./handlers");
const handleVkEvent = require("./handleVkEvent");

// config.bots.forEach((bot) => {
//   exports[bot.name] = functions
//     .region(config.functionsRegion)
//     .https.onRequest(createBot(bot));
// });

// exports.cleanPostsId = functions.pubsub
//   .schedule(config.cleanSchedule)
//   .onRun(cleanPostsId);

exports.handleVkEvent = functions
  .region(config.functionsRegion)
  .https.onRequest(handleVkEvent());

config.bots.forEach((bot) => {
  exports[bot.name] = functions.firestore
    .document(`${bot.name}/{postId}`)
    .onCreate(handleNewPost);
});
