const express = require("express");
const cors = require("cors");
const { debug, info, error, warn } = require("firebase-functions/lib/logger");
const { isAuthenticated } = require("./utils");
const { forwardPost } = require("./handlers");

function createBot(config) {
  const app = express();
  app.use(
    cors({
      origin: true,
    })
  );
  app.use(
    express.urlencoded({
      extended: false,
    })
  );
  app.use(express.json());
  app.post("/", async (req, res) => {
    debug(req.body);
    const eventType = req.body.type;
    if (!isAuthenticated(req, res, config)) return;
    try {
      // if (eventType === "some_event") someHandler(req, res, config)
      if (eventType === "wall_post_new") forwardPost(req, res, config);
    } catch (err) {
      error(err);
    }
    res.send("ok");
    return;
  });
  return app;
}

module.exports = createBot;
