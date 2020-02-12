process.env.NTBA_FIX_319 = 1;

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Telegram = require("node-telegram-bot-api");
const {
  getConfigByName,
  isPostWithTags,
  removeTagsFromPost,
  sendPost,
  isAllowedAuthor,
  isVideoInPost,
  vkConfirm
} = require("./utils");
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
    // try {
    //   config = await getConfigByName(botName, db);
    //   console.log(`Bot config`, config);
    // } catch (error) {
    //   console.error("Couldn't get config");
    //   console.error(error);
    //   res.send("Couldn't get config");
    //   return;
    // }

    // development
    const dummyData = require("./test/dummy/data");
    config = require("./test/dummy/config");
    data = dummyData.postAllowedTag;

    console.log(config);
    console.log(data);

    // confirmation
    try {
      vkConfirm(data, config, res);
    } catch (error) {
      return;
    }

    // main
    if (data.type === "wall_post_new") {
      const post = new Post(data.object, config);
      post.checkConditions();

      // If there are denied tags
      // if (!isPostWithTags(post, config.vk.deniedTags)) {
      //   // If no video in post
      //   if (!isVideoInPost(post)) {
      //     // If authors are allowed
      //     if (isAllowedAuthor(post.created_by, config.vk.allowedAuthors)) {
      //       sendPost(post, config.telegram.channelId, telegramAPI);
      //       // if post with allowed tags
      //     } else if (isPostWithTags(post, config.vk.postTags)) {
      //       post = removeTagsFromPost(post, config.vk.postTags);
      //       sendPost(post, config.telegram.channelId, telegramAPI);
      //     }
      //   }
      // }
    }

    res.send("ok");
  });
  return app;
}

module.exports = createBot;
