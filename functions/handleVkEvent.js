const express = require("express");
const cors = require("cors");
const { debug, info, error, warn } = require("firebase-functions/lib/logger");
const authMiddleware = require("./utils/authMiddleware");
const { db } = require("./api/firebase");
const config = require("./config");

function handleVkEvent() {
  const app = express();
  app.use(cors({ origin: true }));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(authMiddleware);
  app.post("/", async (req, res) => {
    const botConfig = config.bots.find(
      (bot) => req.body.group_id === bot.vk.groupId
    );
    debug(req.body);
    debug(botConfig);
    if (req.body.type === "wall_post_new") {
      const post = req.body.object;
      const groupPostsCollection = db.collection(botConfig.name);
      try {
        groupPostsCollection
          .where("id", "==", post.id)
          .get()
          .then(async (snap) => {
            if (snap.empty) {
              await groupPostsCollection.doc(post.id.toString()).set(post);
            }
          });
      } catch (err) {
        error(err);
      }
    }
    // if (req.body.type === "some_event") { doSomething() }
    return;
  });
  return app;
}

module.exports = handleVkEvent;
