const { expect } = require("chai");
const request = require("supertest");
const createBot = require("../createBot");
const utils = require("../utils");
const defaultConfig = require("./dummy/config");
const data = require("./dummy/data");
const Post = require("../Post");

const allowedAuthors = [11111];
const deniedAuthors = [22222];
const unknownAuthors = [33333];
const allowedTags = ["allowedTag", "allowedTag2"];
const deniedTags = ["deniedTag", "deniedTags2"];
const defaultExpected = { preview: null, message: "post" };

function getPost() {
  return { ...data.post };
}

function makePostAndGetData(post, restrictions) {
  const config = {
    ...defaultConfig,
    restrictions
  };
  const newPost = new Post(post, config);
  if (newPost.isAllowedToSend()) {
    newPost.format();
    return newPost.getData();
  } else {
    return null;
  }
}

describe("Check Confirmation", () => {
  it("Should return callbackStrings", () => {
    expect(utils.vkConfirm(data.confirmation, defaultConfig)).to.equal(
      defaultConfig.vk.callbackString
    );
  });
  it("Should match secrets", () => {
    expect(utils.vkSecret(data.postData, defaultConfig)).to.equal(true);
  });
});

describe("Bot requests", () => {
  before(() => {
    this.app = createBot(defaultConfig.name, defaultConfig);
  });

  describe("Confirmation", () => {
    it("Should send callbackString if confirmation is requested", done => {
      request(this.app)
        .post("/")
        .send(data.confirmation)
        .set("Accept", "application/json")
        .end((err, res) => {
          expect(res.text).to.equal(defaultConfig.vk.callbackString);
          done();
        });
    });
    it("Should send 'wrong secret' if wrong secret", done => {
      const d = Object.assign({}, data.confirmation);
      d.secret = "wrong secret";
      request(this.app)
        .post("/")
        .send(d)
        .end((err, res) => {
          expect(res.text).to.equal("wrong secret");
          done();
        });
    });
  });
});

describe("Configs", () => {
  it("Should return config from database", done => {
    utils.getConfigByName(defaultConfig.name).then(config => {
      expect(config).to.have.keys(["name", "vk", "telegram"]);
      expect(config.name).to.equal(defaultConfig.name);
      expect(config.vk).to.have.keys(["callbackString", "secret", "groupId"]);
      expect(config.telegram).to.have.keys(["channelId", "botToken"]);
      done();
    });
  });
});

describe("Creating Post", () => {
  describe("Post conditions", () => {
    it("If video in post and denyVideo enabled", () => {
      const post = getPost();
      post.attachments = [data.videoAttachment];
      const result = makePostAndGetData(post, { denyVideo: true });
      const expected = null;
      expect(result).to.equal(expected);
    });

    it("If allowed tags in post", () => {
      const post = getPost();
      post.text = `post ${allowedTags[0]}`;
      const result = makePostAndGetData(post, { allowedTags });
      const expected = defaultExpected;
      expect(result).to.deep.equal(expected);
    });

    it("If denied tags in post", () => {
      const post = getPost();
      post.text = `post ${deniedTags[0]}`;
      const result = makePostAndGetData(post, { deniedTags });
      const expected = null;
      expect(result).to.equal(expected);
    });

    it("If denied authors in post", () => {
      const post = getPost();
      post.created_by = deniedAuthors[0];
      const result = makePostAndGetData(post, { deniedAuthors });
      const expected = null;
      expect(result).to.equal(expected);
    });

    it("If allowed authors in post", () => {
      const post = getPost();
      post.created_by = allowedAuthors[0];
      const result = makePostAndGetData(post, { allowedAuthors });
      const expected = defaultExpected;
      expect(result).to.deep.equal(expected);
    });

    it("If restricted posts enabled", () => {
      const post = getPost();
      const result = makePostAndGetData(post, { restrictedPosts: true });
      const expected = null;
      expect(result).to.equal(expected);
    });
  });

  describe("Post methods", () => {
    it("_getMaxSizePhotoUrl should return max size photo url", () => {
      const post = new Post(getPost(), defaultConfig);
      const photoUrl = post._getMaxSizePhotoUrl(data.pictureAttachment.photo);
      const expected =
        "https://sun9-8.userapi.com/c205128/v205128105/39c09/-XXZYob5QUs.jpg";
      expect(photoUrl).to.equal(expected);
    });

    it("_hasAuthor should return boolean if post has allowed or denied author", () => {
      const p = getPost();
      p.created_by = unknownAuthors[0];
      const post = new Post(p, defaultConfig);
      expect(post._hasAuthor("allowedAuthors")).to.equal(false);
      post.restrictions = { allowedAuthors };
      post.post.created_by = allowedAuthors[0];
      expect(post._hasAuthor("allowedAuthors")).to.equal(true);
      expect(post._hasAuthor("deniedAuthors")).to.equal(false);
      post.restrictions = { deniedAuthors };
      post.post.created_by = deniedAuthors[0];
      expect(post._hasAuthor("deniedAuthors")).to.equal(true);
    });

    it("_hasPreview should return boolean if post has a preview", () => {
      const p = getPost();
      const post = new Post(p, defaultConfig);
      expect(post._hasPreview()).to.equal(false);
      post.post.attachments = [];
      expect(post._hasPreview()).to.equal(false);
      post.post.attachments = [data.pictureAttachment];
      expect(post._hasPreview()).to.equal(true);
      post.post.attachments = [data.pictureAttachment, data.videoAttachment];
      expect(post._hasPreview()).to.equal(true);
      post.post.attachments = [data.videoAttachment];
      expect(post._hasPreview()).to.equal(false);
    });

    it("_hasTags should return boolean if post has allowed or denied tags", () => {
      const p = getPost();
      const post = new Post(p, defaultConfig);
      expect(post._hasTags("allowedTags")).to.equal(false);
      post.post.text = `post ${allowedTags[0]}`;
      post.restrictions = { allowedTags };
      expect(post._hasTags("allowedTags")).to.equal(true);
      expect(post._hasTags("deniedTags")).to.equal(false);
      post.post.text = `post ${deniedTags[0]}`;
      post.restrictions = { deniedTags };
      expect(post._hasTags("deniedTags")).to.equal(true);
      post.post.text = `post ${allowedTags[0]} ${deniedTags[0]}`;
      post.restrictions = { allowedTags, deniedTags };
      expect(post._hasTags("allowedTags")).to.equal(true);
      expect(post._hasTags("deniedTags")).to.equal(true);
    });

    it("_hasVideoInPost should return boolean if post has a video", () => {
      const p = getPost();
      const post = new Post(p, defaultConfig);
      expect(post._hasVideoInPost()).to.equal(false);
      post.post.attachments = [data.videoAttachment];
      expect(post._hasVideoInPost()).to.equal(true);
      post.post.attachments = [data.pictureAttachment];
      expect(post._hasVideoInPost()).to.equal(false);
    });

    it("_makeMessage should return a formatted message without tags and preview link if needed", () => {
      const p = getPost();
      const post = new Post(p, defaultConfig);
      expect(post._makeMessage()).to.equal("post");
      post.post.text = `post ${allowedTags[0]}`;
      post.restrictions = { allowedTags };
      expect(post._makeMessage()).to.equal("post");
      post.post.text = data.longText;
      expect(post._makeMessage()).to.equal(data.longText);
      post.post.text = data.longText;
      post.post.attachments = [data.pictureAttachment];
      post.preview = post._makePreview();
      expect(post._makeMessage()).to.equal(
        data.longText + `\n<a href="${post.preview.url}">&#160;</a>`
      );
    });

    it("_makePreview should return formatted object with preview data", () => {
      const p = getPost();
      const post = new Post(p, defaultConfig);
      expect(post._makePreview()).to.equal(null);
      post.post.attachments = [data.pictureAttachment];
      expect(post._makePreview()).to.deep.equal({
        type: "photo",
        url:
          "https://sun9-8.userapi.com/c205128/v205128105/39c09/-XXZYob5QUs.jpg"
      });
      post.post.attachments = [data.videoAttachment];
      expect(post._makePreview()).to.equal(null);
    });

    it("_removeTagsFromText should return formatted text without tags", () => {
      const p = getPost();
      p.text = `post ${allowedTags[0]} ${deniedTags[0]}`;
      const post = new Post(p, defaultConfig);
      post.restrictions = { allowedTags, deniedTags };
      expect(post._removeTagsFromText(post.post.text)).to.equal("post");
    });
  });
});
