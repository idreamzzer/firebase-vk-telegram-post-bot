const config = {
  googleCredentials: {
    type: "service_account",
    project_id: "000",
    private_key_id: "000",
    private_key: "000",
    client_email: "000",
    client_id: "000",
    auth_uri: "000",
    token_uri: "000",
    auth_provider_x509_cert_url: "000",
    client_x509_cert_url: "000",
  },
  bots: [
    {
      name: "sandbox",
      vk: {
        callbackString: "000",
        groupId: "000",
        secret: "000",
      },
      telegram: {
        botToken: "000:000",
        channelId: "000",
      },
    },
  ],
  functionsRegion: "europe-west1",
  cleanSchedule: "0 1 * * *",
};

module.exports = config;
