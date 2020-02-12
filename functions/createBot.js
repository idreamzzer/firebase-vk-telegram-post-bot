process.env.NTBA_FIX_319 = 1;

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Telegram = require("node-telegram-bot-api");
const {
  getBotByName,
  isPostWithTags,
  removeTagsFromPost,
  sendPost,
  isAllowedAuthor,
  isVideoInPost
} = require("./utils");

function createBot(botName, db) {
  const app = express();
  app.use(cors({ origin: true }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.post("/", async (req, res) => {
    // getting config
    let vkConfig = {};
    let telegramConfig = {};
    try {
      const config = await getBotByName(db, botName);
      vkConfig = config.vk;
      telegramConfig = config.telegram;
      console.log(`Bot config`, config);
    } catch (error) {
      console.error("Couldn't get config");
      console.error(error);
      res.send("Couldn't get config");
      return;
    }

    // confirmation
    if (req.body.secret !== vkConfig.secretKey) {
      console.log("Wrong secret");
      res.send("wrong secret");
      return;
    }
    if (
      req.body.type == "confirmation" &&
      req.body.group_id == vkConfig.groupId
    ) {
      console.log("Confirmation successful");
      res.send(vkConfig.callbackConfirmationString);
      return;
    }

    // main
    const telegramAPI = new Telegram(telegramConfig.botToken);
    const { type, object: data, group_id } = req.body;
    console.log("Request data", data);

    if (type === "wall_post_new") {
      let post = data;

      // If there are denied tags
      if (!isPostWithTags(post, vkConfig.deniedTags)) {
        // If no video in post
        if (!isVideoInPost(post)) {
          // If authors are allowed
          if (isAllowedAuthor(post.created_by, vkConfig.allowedAuthors)) {
            sendPost(post, telegramConfig.channelId, telegramAPI);
            // if post with allowed tags
          } else if (isPostWithTags(post, vkConfig.postTags)) {
            post = removeTagsFromPost(post, vkConfig.postTags);
            sendPost(post, telegramConfig.channelId, telegramAPI);
          }
        }
      }
    }

    res.send("ok");
  });
  return app;
}

module.exports = createBot;
