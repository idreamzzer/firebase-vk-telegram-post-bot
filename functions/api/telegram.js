process.env.NTBA_FIX_319 = 1;
process.env.NTBA_FIX_350 = 1;
const Tg = require("node-telegram-bot-api");
const { debug, info, error, warn } = require("firebase-functions/lib/logger");
const {
  chunkSubstr,
  cleanTemporary,
  getPhotosUrlFromAttachments,
  formatWebpImagesToJpg,
} = require("../utils");

class Telegram {
  constructor({ botToken, channelId }) {
    this.telegramApi = new Tg(botToken);
    this.channelId = channelId;
  }

  async sendMessageWithMultiplePhotos(text, photosUrl) {
    let photos = photosUrl.map((url) => ({ type: "photo", media: url }));
    if (photos.length > 10) {
      photos = photos.slice(0, 10);
    }
    if (text.length <= 1024) {
      photos[0].caption = text;
      await this.telegramApi.sendMediaGroup(-this.channelId, photos, {
        disable_notification: false,
        parse_mode: "HTML",
      });
    } else {
      const [firstTextChunk, ...otherTextChunks] = chunkSubstr(
        text,
        4096,
        1024
      );
      photos[0].caption = firstTextChunk;
      await this.telegramApi.sendMediaGroup(-this.channelId, photos, {
        disable_notification: false,
        parse_mode: "HTML",
      });
      await this.sendLongMessage(otherTextChunks.join(" "), {
        oneNotification: false,
      });
    }
  }

  async sendMessageWithPhoto(text = "", photoUrl, options) {
    const [firstTextChunk, ...otherTextChunks] = chunkSubstr(text, 4096, 1024);
    await this.telegramApi.sendPhoto(-this.channelId, photoUrl, {
      caption: firstTextChunk,
      parse_mode: "HTML",
      ...options,
    });

    if (text.length > 1024) {
      await this.sendLongMessage(otherTextChunks.join(" "), {
        oneNotification: false,
      });
    }
  }

  async sendLongMessage(
    text,
    options = { oneNotification: true, chunkLength: 4096, startOffset: 0 }
  ) {
    const {
      oneNotification = true,
      chunkLength = 4096,
      startOffset = 0,
    } = options;

    const textChunks = chunkSubstr(text.slice(startOffset), chunkLength);

    if (oneNotification) {
      await this.telegramApi.sendMessage(-this.channelId, textChunks[0], {
        disable_notification: false,
        parse_mode: "HTML",
      });
      for (let i = 1; i < textChunks.length; i++) {
        await this.telegramApi.sendMessage(-this.channelId, textChunks[i], {
          disable_notification: true,
          parse_mode: "HTML",
        });
      }
      return;
    }

    for (let text of textChunks) {
      await this.telegramApi.sendMessage(-this.channelId, text, {
        disable_notification: true,
        parse_mode: "HTML",
      });
    }
  }

  async sendPost(post) {
    if (post.attachments?.length) {
      let photosUrl = getPhotosUrlFromAttachments(post.attachments);
      photosUrl = await formatWebpImagesToJpg(photosUrl);
      if (photosUrl.length > 1) {
        await this.sendMessageWithMultiplePhotos(post.text, photosUrl);
      } else if (photosUrl.length === 1) {
        await this.sendMessageWithPhoto(post.text, photosUrl[0]);
      }
      // cleanTemporary();
      return;
    }
    await this.sendLongMessage(post.text);
  }
}

module.exports = Telegram;
