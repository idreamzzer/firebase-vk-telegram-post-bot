const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { getConfigByName, vkConfirm } = require("./utils");
const Post = require("./Post");

function createBot(botName, db) {
  // express settings
  const app = express();
  app.use(cors({ origin: true }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.post("/", async (req, res) => {
    let data = req.body;
    let config = null;

    // getting config
    try {
      config = await getConfigByName(botName, db);
    } catch (error) {
      console.error("Couldn't get config");
      console.error(error);
      res.send("Couldn't get config");
      return;
    }

    console.log("config: ", config);
    console.log("data: ", data);

    // confirmation
    try {
      vkConfirm(data, config, res);
    } catch (error) {
      return;
    }

    // main
    if (data.type === "wall_post_new") {
      const post = new Post(data.object, config);
      if (post.isAllowedToSend()) {
        post.format();
        post.send();
      }
    }

    res.send("ok");
  });
  return app;
}

module.exports = createBot;
