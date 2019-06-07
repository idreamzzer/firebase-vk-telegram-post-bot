const config = {
  googleCredentials: require('./serviceAccountKey.json'),
  functions: [
    {
      name: '111',
      vk: {
        groupId: 111,
        callbackConfirmationString: '111',
        secretKey: '111',
        postTags: ['&#13;', '\r'],
      },
      telegram: {
        botToken: '111:111',
        channelId: 111,
      },
    },
  ],
};

module.exports = config;
