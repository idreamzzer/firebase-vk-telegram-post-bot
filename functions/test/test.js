const chai = require("chai");
const expect = chai.expect;
const defaultConfig = require("./dummy/config");
const data = require("./dummy/data");
const Post = require("../Post");

const allowedAuthor = 11111;
const deniedAuthor = 22222;
const unknownAuthor = 33333;
const allowedTag = "allowedTag";
const deniedTag = "deniedTag";

function makePostAndGetData(postData, restrictions) {
  const config = {
    ...defaultConfig,
    restrictions
  };
  const post = new Post(postData.object, config);
  if (post.isAllowedToSend()) {
    post.format();
    return post.getData();
  } else {
    return null;
  }
}

function changePostText(postData, text) {
  const post = Object.create(postData);
  post.object.text = text;
  return post;
}

describe("Creating Posts", () => {
  describe("Post simple", () => {
    it("should return formatted post data", () => {
      const result = makePostAndGetData(data.post);
      const expected = {
        preview: null,
        message: "post"
      };
      expect(result).to.deep.equal(expected);
    });
  });

  describe("Post with unknown author", () => {
    it("should return formatted post data if restrictedPosts is disabled", () => {
      const post = data.post;
      post.object.created_by = allowedAuthor;
      const result = makePostAndGetData(data.postUnknownAuthor, {
        restrictedPosts: false
      });
      const expected = {
        preview: null,
        message: "postUnknownAuthor"
      };
      expect(result).to.deep.equal(expected);
    });
    it("should return null if restrictedPosts is enabled", () => {
      const post = data.post;
      post.object.created_by = unknownAuthor; // unknown author
      const result = makePostAndGetData(post, {
        restrictedPosts: true
      });
      const expected = null;
      expect(result).to.equal(expected);
    });
    it("should return formatted data if restrictedPosts is enabled and allowed tag is used", () => {
      const post = data.post;
      post.object.text = `post ${allowedTag}`;
      const result = makePostAndGetData(post, {
        restricredPosts: true,
        allowedTags: [allowedTag]
      });
      const expected = {
        preview: null,
        message: "post"
      };
      expect(result).to.deep.equal(expected);
    });
  });

  describe("Post with denied author", () => {
    it("should return null", () => {
      const post = data.post;
      post.object.created_by = deniedAuthor;
      const result = makePostAndGetData(post, {
        deniedAuthors: [deniedAuthor]
      });
      const expected = null;
      expect(result).to.equal(expected);
    });
    it("should return formatted data if allowed tag is used", () => {
      const post = data.post;
      post.object.text = `post ${allowedTag}`;
      post.object.created_by = deniedAuthor;
      const result = makePostAndGetData(post, {
        deniedAuthors: [allowedAuthor],
        allowedTags: [allowedTag]
      });
      const expected = {
        preview: null,
        message: "post"
      };
      expect(result).to.deep.equal(expected);
    });
  });

  describe("Post with allowed tags", () => {
    it("should return formatted data if multiple tags in post", () => {
      const post = data.post;
      post.object.text = `${allowedTag} post ${allowedTag}2`;
      const result = makePostAndGetData(post, {
        allowedTags: [allowedTag, allowedTag + "2"]
      });
      const expected = {
        preview: null,
        message: "post"
      };
      expect(result).to.deep.equal(expected);
    });
    it("should return formatted data if allowed tag and denied tag are used", () => {
      const post = data.post;
      post.object.text = `post ${allowedTag} ${deniedTag}`;
      const result = makePostAndGetData(post, {
        allowedTags: [allowedTag],
        deniedTags: [deniedTag]
      });
      const expected = {
        preview: null,
        message: "post"
      };
      expect(result).to.deep.equal(expected);
    });
  });
});
