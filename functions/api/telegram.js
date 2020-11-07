process.env.NTBA_FIX_319 = 1;
const Tg = require("node-telegram-bot-api");
const { chunkSubstr } = require("../utils");

class Telegram {
  constructor({ botToken, channelId }) {
    this.telegramApi = new Tg(botToken);
    this.channelId = channelId;
  }

  async sendMessageWithMultiplePhotos(text, photosUrl) {
    const photos = photosUrl.map((url) => ({ type: "photo", media: url }));
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
      photos[0].caption = text.slice(0, 1024);
      await this.telegramApi.sendMediaGroup(-this.channelId, photos, {
        disable_notification: false,
        parse_mode: "HTML",
      });
      await this.sendLongMessage(text, {
        startOffset: 1024,
        oneNotification: false,
      });
    }
  }

  async sendMessageWithPhoto(text = "", photoUrl, options) {
    await this.telegramApi.sendPhoto(-this.channelId, photoUrl, {
      caption: text.slice(0, 1024),
      parse_mode: "HTML",
      ...options,
    });

    if (text.length > 1024) {
      await this.sendLongMessage(text, {
        startOffset: 1024,
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
}

module.exports = Telegram;
