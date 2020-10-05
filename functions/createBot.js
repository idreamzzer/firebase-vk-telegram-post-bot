const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {
  debug,
  info,
  error,
  warn
} = require("firebase-functions/lib/logger");
const {
  getConfigByName,
  vkConfirm,
  vkSecret,
  checkEventId
} = require("./utils");
const Post = require("./Post");

function createBot(botName, config) {
  // express settings
  const app = express();
  app.use(cors({
    origin: true
  }));
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());

  app.post("/", async (req, res) => {
    let data = req.body;

    // getting config
    if (!config) {
      try {
        config = await getConfigByName(botName);
      } catch (err) {
        error("Couldn't get config");
        error(err);
        res.send("Couldn't get config");
        return;
      }
    }

    // confirmation
    if (!vkSecret(data, config)) {
      res.send("wrong secret");
      return;
    }
    if (vkConfirm(data, config)) {
      res.send(vkConfirm(data, config));
      return;
    }

    info(botName);
    debug(JSON.stringify(data));
    debug(JSON.stringify(config));

    // main
    if (data.type === "wall_post_new") {
      res.send("ok");
      if (await checkEventId(data.event_id)) {
        const post = new Post(data.object, config);
        if (post.isAllowedToSend()) {
          post.format();
          post.send();
        }
      }
      return;
    }

    res.send("ok");
  });
  return app;
}

module.exports = createBot;