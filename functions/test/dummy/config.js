module.exports = {
  name: "sandbox",
  vk: {
    callbackString: "12345678",
    groupId: 22222,
    secretKey: "secret"
  },
  telegram: {
    botToken: "123123123123:QdsaFQWFUhqfiu1231hdiaufsdf",
    channelId: 33333
  },
  restrictions: {
    allowedAuthors: [11111],
    allowedTags: ["allowedTag", "allowedTag2"],
    deniedTags: ["deniedTag"],
    deniedAuthors: [99999],
    denyVideoPost: true,
    restrictedPosts: true
  }
};
