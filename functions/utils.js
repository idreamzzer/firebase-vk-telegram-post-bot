const { db } = require("./api/firebase");

function getConfigByName(botName) {
  const bots = db.collection("bots");
  return new Promise((resolve, reject) => {
    bots
      .where("name", "==", botName)
      .get()
      .then(snap => {
        if (snap.empty) {
          console.log("No matching bots");
          reject("No matching bots");
        }
        snap.forEach(doc => {
          resolve(doc.data());
        });
      })
      .catch(error => reject(error));
  });
}

function vkSecret(data, config) {
  if (data.secret !== config.vk.secret) {
    return null;
  }
  return true;
}

function vkConfirm(data, config) {
  if (data.type == "confirmation" && data.group_id == config.vk.groupId) {
    return config.vk.callbackString;
  }
  return null;
}

module.exports = {
  vkSecret,
  vkConfirm,
  getConfigByName
};
