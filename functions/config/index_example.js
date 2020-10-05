const config = {
  googleCredentials: require("./serviceAccountKey.json"),
  bots: ["sandbox"],
  functionsRegion: 'europe-west1',
  cleanSchedule: '0 1 * * *'
};

module.exports = config;