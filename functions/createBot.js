const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { getConfigByName, vkConfirm, vkSecret } = require("./utils");
const Post = require("./Post");

function createBot(botName, config) {
  // express settings
  const app = express();
  app.use(cors({ origin: true }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.post("/", async (req, res) => {
    let data = req.body;

    // getting config
    if (!config) {
      try {
        config = await getConfigByName(botName);
      } catch (error) {
        console.error("Couldn't get config");
        console.error(error);
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

    console.log(data);
    console.log(config);

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
