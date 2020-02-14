function getConfigByName(botName, db) {
  const bots = db.collection("bots");
  return new Promise((resolve, reject) => {
    bots
      .where("name", "==", botName)
      .get()
      .then(snap => {
        if (snap.empty) {
          console.log("No matching bots.");
          reject("No matching bots.");
        }
        snap.forEach(doc => {
          resolve(doc.data());
        });
      })
      .catch(error => reject(error));
  });
}

function vkConfirm(data, config, response) {
  if (data.secret !== config.vk.secretKey) {
    let msg = "Wrong secret";
    console.error(msg);
    response.send(msg);
    throw msg;
  }
  if (data.type == "confirmation" && data.group_id == config.vk.groupId) {
    let msg = "Confirmation successful";
    console.log(msg);
    response.send(config.vk.callbackConfirmationString);
    throw msg;
  }
}

module.exports = {
  vkConfirm,
  getConfigByName
};
