const config = {
  googleCredentials: require('./serviceAccountKey.json'),
  functions: {
    bot: {
      vk: {
        groupId: 000,
        callbackConfirmationString: '000',
        secretKey: '000',
        postTags: ['&#13;'],
      },
      telegram: {
        botToken: '000:000',
        channelId: 000,
      },
    },
    test: {
      vk: {
        groupId: 000,
        callbackConfirmationString: '000',
        secretKey: '000',
        postTags: ['&#13;'],
      },
      telegram: {
        botToken: '000:000',
        channelId: 000,
      },
    },
  },
};

module.exports = config;
