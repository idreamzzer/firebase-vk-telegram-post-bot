const Telegram = require("node-telegram-bot-api");

class Post {
  default = {
    getAllPosts: true
  };
  constructor(post, config) {
    this.config = config;
    this.post = post;
    this.telegramApi = new Telegram(config.telegram.botToken);
  }

  checkConditions() {
    console.log("conditions");
    // If there are denied tags
    if (this._hasTags("deniedTags")) {
      console.log("deniedTags");
      return;
    }

    // If video in post
    if (this._hasVideoInPost()) {
      console.log("videoInPost");
      return;
    }

    // If denied author
    if (this._hasAuthor("deniedAuthors")) {
      console.log("deniedAuthor");
      return;
    }

    // If authors are allowed
    if (this._hasAuthor("allowedAuthors")) {
      console.log("allowedAuthor");
      //   sendPost(this.post, this.config.telegram.channelId, this.telegramAPI);
      // if post with allowed tags
    }
    if (this._hasTags("allowedTags")) {
      console.log("allowedTags");
      //   let post = removeTagsFromPost(this.post, this.config.vk.postTags);
      //   sendPost(post, this.config.telegram.channelId, this.telegramAPI);
    }
  }

  _hasAuthor(type) {
    const authorId = this.post.created_by;
    const authors = this.config.vk[type];
    if (!authors) return false;
    return authors.includes(authorId);
  }
  _hasTags(type) {
    const tags = this.config.vk[type];
    const post = this.post;
    if (!tags) return false;
    const loweredText = post.text.toLowerCase();
    for (let tag of tags) {
      let regexp = new RegExp(tag.toLowerCase());
      if (regexp.test(loweredText)) {
        return true;
      }
    }
    return false;
  }
  _hasVideoInPost() {}
}

module.exports = Post;
