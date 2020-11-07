const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { debug, info, error, warn } = require("firebase-functions/lib/logger");
const { isPostUnique, isAllowedToSend } = require("./utils");
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

    if (data.type === "wall_post_new") {
      const post = data.object;
      if (
        (await isPostUnique(post)) &&
        (await isAllowedToSend(post, botConfig))
      ) {
        forwardPost(post, botConfig);
      }
    }

    res.send("ok");
  });
  return app;
}

module.exports = createBot;
