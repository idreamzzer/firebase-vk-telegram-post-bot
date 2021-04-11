process.env.NTBA_FIX_319 = 1;
process.env.NTBA_FIX_350 = 1;
// const { debug, info, error, warn } = require("firebase-functions/lib/logger");
const Telegram = require("./api/telegram");
const {
  getPhotosUrlFromAttachments,
  formatWebpImagesToJpg,
} = require("./utils");

async function forwardPost(post, botConfig) {
  const telegram = new Telegram(botConfig.telegram);

  // handle attachments
  if (post.attachments) {
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
  return;
}

module.exports = forwardPost;
