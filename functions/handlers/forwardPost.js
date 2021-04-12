process.env.NTBA_FIX_319 = 1;
process.env.NTBA_FIX_350 = 1;
// const { debug, info, error, warn } = require("firebase-functions/lib/logger");
const Telegram = require("../api/telegram");
const {
  getPhotosUrlFromAttachments,
  formatWebpImagesToJpg,
  handleAttachments,
  shouldForwardPost,
  cleanTemporary,
} = require("../utils");

async function forwardPost(req, res, config) {
  const post = req.body.object;
  const telegram = new Telegram(config.telegram);

  if (!shouldForwardPost(post, config)) return;

  // handle attachments
  if (post.attachments) {
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

  return;
}

module.exports = forwardPost;
