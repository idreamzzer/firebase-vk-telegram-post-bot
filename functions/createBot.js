const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { debug, info, error, warn } = require("firebase-functions/lib/logger");
// const { checkEventId, getRestrictions } = require("./utils");
// const Post = require("./Post");
const forwardPost = require("./forwardPost");

function createBot(botConfig) {
  const app = express();
  app.use(
    cors({
      origin: true,
    })
  );
  app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );
  app.use(bodyParser.json());

  app.post("/", async (req, res) => {
    let data = req.body;

    if (!botConfig) {
      error("No bot config");
      return null;
    }
    if (data.secret !== botConfig.vk.secret) {
      error("wrong secret", data.secret, botConfig.vk.secret);
      return null;
    }
    if (data.type == "confirmation" && data.group_id == botConfig.vk.groupId) {
      return botConfig.vk.callbackString;
    }

    // debug(botConfig);
    // debug(data);

    // main
    if (data.type === "wall_post_new") {
      forwardPost(data.object, botConfig);
      // need for preventing duplicates
      // if (await checkEventId(data.event_id)) {
      // const restrictions = await getRestrictions(botConfig.name);
      // const post = new Post(data.object, botConfig, restrictions);
      // if (post.isAllowedToSend()) {
      //   post.format();
      //   post.send();
      // }
      // }
    }

    res.send("ok");
  });
  return app;
}

module.exports = createBot;
