const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Telegram = require('node-telegram-bot-api');
const {
  isPostWithTags,
  removeTagsFromPost,
  getPreviewFromPost,
  sendPost,
  sendPostWithPreview,
} = require('./utils');

function createBot(config) {
  const app = express();

  app.use(cors({ origin: true }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.post('/', (req, res) => {
    const { name: botName, vk: vkConfig, telegram: telegramConfig } = config;

    // confirmation
    if (req.body.secret !== vkConfig.secretKey) {
      req.send('wrong secret');
    }
    if (
      req.body.type == 'confirmation' &&
      req.body.group_id == vkConfig.groupId
    ) {
      console.log('Confirmation successful');
      res.send(vkConfig.callbackConfirmationString);
      return;
    }

    const telegramAPI = new Telegram(telegramConfig.botToken);
    const { type, object: data, group_id } = req.body;
    if (type === 'wall_post_new') {
      let post = data;

      if (isPostWithTags(post, vkConfig.postTags)) {
        console.log(`~~~ NEW POST IN: ${botName}(${group_id}) ~~~`);
        console.log(post.text);

        post = removeTagsFromPost(post, vkConfig.postTags);
        const preview = getPreviewFromPost(post);
        if (preview && preview.type && preview.url) {
          sendPostWithPreview(
            post,
            preview,
            telegramConfig.channelId,
            telegramAPI
          );
        } else {
          sendPost(post, telegramConfig.channelId, telegramAPI);
        }
      }
    }

    res.send('ok');
  });
  return app;
}

module.exports = createBot;
