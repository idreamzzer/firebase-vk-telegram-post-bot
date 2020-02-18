process.env.NTBA_FIX_319 = 1;
const Telegram = require("node-telegram-bot-api");

class Post {
  constructor(post, config) {
    this.config = config;
    this.restrictions = config.restrictions || {};
    this.post = post;
    this.telegramApi = new Telegram(config.telegram.botToken);
    this.preview = null;
    this.message = "";
    this.messageLength = 0;
  }

  isAllowedToSend() {
    if (this._hasVideoInPost()) {
      // console.log("video in post");
      return !this.restrictions.denyVideo;
    }
    if (this._hasTags("allowedTags")) {
      // console.log("allowed tags");
      return true;
    }
    if (this._hasTags("deniedTags")) {
      // console.log("denied tags");
      return false;
    }
    if (this._hasAuthor("deniedAuthors")) {
      // console.log("denied authors");
      return false;
    }
    if (this._hasAuthor("allowedAuthors")) {
      // console.log("allowed authors");
      return true;
    }
    if (Boolean(this.restrictions.restrictedPosts)) {
      // console.log("restricted post");
      // console.log(this.restrictions.restrictedPosts);
      return false;
    }
    return true;
  }

  format() {
    if (this._hasPreview) {
      this.preview = this._makePreview();
    }
    this.message = this._makeMessage();
  }

  async send() {
    const channelId = -this.config.telegram.channelId;
    const options = {
      parse_mode: "HTML"
    };
    const message = this.message;

    try {
      if (this.messageLength <= 1024 && this.preview) {
        const { type, url } = this.preview;
        options.caption = message;
        if (type === "photo") {
          await this.telegramApi.sendPhoto(channelId, url, options);
        } else if (type === "doc") {
          await this.telegramApi.sendDocument(channelId, url, options);
        }
      } else {
        await this.telegramApi.sendMessage(channelId, message, options);
      }
    } catch (error) {
      console.error(`Couldn't send to telegram`);
      console.error(error);
    }
  }

  // for testing
  getData() {
    const { preview, message } = this;
    return {
      preview,
      message
    };
  }

  _getMaxSizePhotoUrl(photo) {
    return photo.sizes.find(
      size => size.width === Math.max(...photo.sizes.map(s => s.width), 0)
    ).url;
  }
  _hasAuthor(type) {
    const authorId = this.post.created_by;
    const authors = this.restrictions[type];
    if (!authors) return false;
    return authors.includes(authorId);
  }
  _hasPreview() {
    if (!this.post.attachments) return false;
    return !!this.post.attachments.find(
      attach =>
        attach.type === "photo" ||
        (attach.type === "doc" && attach.doc.ext === "gif")
    );
  }
  _hasTags(type) {
    const tags = this.restrictions[type];
    if (!tags) return false;
    const text = this.post.text.toLowerCase();
    for (let tag of tags) {
      let regexp = new RegExp(tag.toLowerCase());
      if (regexp.test(text)) {
        return true;
      }
    }
    return false;
  }
  _hasVideoInPost() {
    if (!this.post.attachments) return false;
    for (let attachment of this.post.attachments) {
      if (attachment.type === "video") return true;
    }
    return false;
  }
  _makeMessage() {
    let message = this._removeTagsFromText(this.post.text);
    this.messageLength = message.length;
    if (this.messageLength > 1024 && this.preview) {
      message = message + `\n<a href="${this.preview.url}">&#160;</a>`;
    }
    return message;
  }
  _makePreview() {
    if (!this.post.attachments) return null;
    for (let attachment of this.post.attachments) {
      if (attachment.type === "photo") {
        return {
          type: attachment.type,
          url: this._getMaxSizePhotoUrl(attachment.photo)
        };
      } else if (attachment.type === "doc" && attachment.doc.ext === "gif") {
        return {
          type: attachment.type,
          url: attachment.doc.url
        };
      }
    }
    return null;
  }
  _removeTagsFromText(text) {
    const { allowedTags, deniedTags } = this.restrictions;
    if (!allowedTags && !deniedTags) return text.trim();
    const tags = [
      ...(Array.isArray(this.restrictions.allowedTags)
        ? this.restrictions.allowedTags
        : ""),
      ...(Array.isArray(this.restrictions.deniedTags)
        ? this.restrictions.deniedTags
        : "")
    ];
    if (!tags) return text;
    let newText = text;
    for (let tag of tags) {
      newText = newText.replace(tag, "");
    }
    return newText.trim();
  }
}

module.exports = Post;
