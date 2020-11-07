process.env.NTBA_FIX_319 = 1;
// const { debug, info, error, warn } = require("firebase-functions/lib/logger");
const Telegram = require("./api/telegram");
const { getPhotosUrlFromAttachments } = require("./utils");

async function forwardPost(post, botConfig) {
  const telegram = new Telegram(botConfig.telegram);

  // handle attachments
  if (post.attachments) {
    const photosUrl = getPhotosUrlFromAttachments(post.attachments);
    if (photosUrl.length > 1) {
      await telegram.sendMessageWithMultiplePhotos(post.text, photosUrl);
    } else if (photosUrl.length === 1) {
      await telegram.sendMessageWithPhoto(post.text, photosUrl[0]);
    } else {
      await telegram.sendLongMessage(post.text);
    }
    return;
  }

  await telegram.sendLongMessage(post.text);
  return;
}

module.exports = forwardPost;
