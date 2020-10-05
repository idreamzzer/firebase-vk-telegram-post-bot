const {
  db
} = require("./api/firebase");
const {
  debug,
  info,
  error,
  warn
} = require("firebase-functions/lib/logger");

function getConfigByName(botName) {
  const bots = db.collection("bots");
  return new Promise((resolve, reject) => {
    bots
      .where("name", "==", botName)
      .get()
      .then(snap => {
        if (snap.empty) {
          warn("No matching bots");
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

function checkEventId(eventId) {
  const events = db.collection('temp_events');
  return new Promise((resolve, reject) => {
    events
      .where("id", "==", eventId)
      .get()
      .then(async (snap) => {
        if (snap.empty) {
          await events.add({
            id: eventId
          });
          resolve(true);
        }
        warn('duplication');
        resolve(false);
      }).catch(error => reject(error))
  });
}

module.exports = {
  vkSecret,
  vkConfirm,
  getConfigByName,
  checkEventId
};