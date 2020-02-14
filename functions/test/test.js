const chai = require("chai");
const expect = chai.expect;
const defaultConfig = require("./dummy/config");
const data = require("./dummy/data");
const Post = require("../Post");

function makePostAndGetData(postData, restrictions) {
  const config = {
    ...defaultConfig,
    restrictions: { ...defaultConfig.restrictions, ...restrictions }
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
      const result = makePostAndGetData(data.postUnknownAuthor, {
        restricredPosts: true
      });
      const expected = null;
      expect(result).to.equal(expected);
    });
    it("should return formatted data if restrictedPosts is enabled and allowed tag is used", () => {
      const postData = changePostText(
        data.post,
        "postUnknownAuthor allowedTag"
      );
      const result = makePostAndGetData(postData, {
        restricredPosts: true
      });
      const expected = {
        preview: null,
        message: "postUnknownAuthor"
      };
      expect(result).to.deep.equal(expected);
    });
  });

  describe("Post with denied author", () => {
    it("should return null", () => {
      const result = makePostAndGetData(data.postDeniedAuthor);
      const expected = null;
      expect(result).to.equal(expected);
    });
    it("should return formatted data if allowed tag is used", () => {
      const postData = changePostText(
        data.postDeniedAuthor,
        "postDeniedAuthor allowedTag"
      );
      const result = makePostAndGetData(postData);
      const expected = {
        preview: null,
        message: "postDeniedAuthor"
      };
      expect(result).to.deep.equal(expected);
    });
  });

  describe("Post with allowed tags", () => {
    it("should return formatted data if multiple tags in post", () => {
      const postData = changePostText(data.post, "allowedTag post allowedTag2");
      const result = makePostAndGetData(postData);
      const expected = {
        preview: null,
        message: "post"
      };
      expect(result).to.deep.equal(expected);
    });
    it("should return formatted data if allowed tag and denied tag are used", () => {
      const postData = changePostText(data.post, "post allowedTag deniedTag");
      const result = makePostAndGetData(postData);
      const expected = {
        preview: null,
        message: "post"
      };
      expect(result).to.deep.equal(expected);
    });
  });
});
