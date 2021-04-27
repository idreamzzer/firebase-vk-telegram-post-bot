process.env.NTBA_FIX_319 = 1;
process.env.NTBA_FIX_350 = 1;
// const { debug, info, error, warn } = require("firebase-functions/lib/logger");
const Telegram = require("./api/telegram");
const { debug, info, error, warn } = require("firebase-functions/lib/logger");
const {
  getPhotosUrlFromAttachments,
  formatWebpImagesToJpg,
  //   handleAttachments,
  //   shouldForwardPost,
  cleanTemporary,
  isAllowedToSend,
} = require("./utils");
const config = require("./config");

async function handleNewPost(snap, context) {
  debug("onCreate");
  debug(snap.data());
  const post = snap.data();
  const botConfig = config.bots.find(
    (bot) => -bot.vk.groupId === post.owner_id
  );

  const telegram = new Telegram(botConfig.telegram);

  if (!(await isAllowedToSend(post, botConfig.name))) return;

  if (post.attachments) {
    //   if (!shouldForwardPost(post, botConfig)) return;

    // handle attachments
    // post.attachments = handleAttachments(post.attachments);
    let photosUrl = getPhotosUrlFromAttachments(post.attachments);
    photosUrl = await formatWebpImagesToJpg(photosUrl);
    if (photosUrl.length > 1) {
      await telegram.sendMessageWithMultiplePhotos(post.text, photosUrl);
    } else if (photosUrl.length === 1) {
      await telegram.sendMessageWithPhoto(post.text, photosUrl[0]);
    }
    return;
  }

  await telegram.sendLongMessage(post.text);

  cleanTemporary();
}

module.exports = handleNewPost;
