const Telegram = require("./api/telegram");
const { debug, info, error, warn } = require("firebase-functions/lib/logger");
const { isAllowedToSend } = require("./utils");
const config = require("./config");

async function handleNewPost(snap, context) {
  debug("onCreate");
  debug(snap.data());
  const post = snap.data();
  const botConfig = config.bots.find(
    (bot) => -bot.vk.groupId === post.owner_id
  );

  const telegram = new Telegram(botConfig.telegram);

  const isAllowed = await isAllowedToSend(post, botConfig.name);
  if (isAllowed) {
    await telegram.sendPost(post);
  }
}

module.exports = handleNewPost;
