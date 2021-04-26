const config = require("../config");
const { debug, info, error, warn } = require("firebase-functions/lib/logger");

function authMiddleware(req, res, next) {
  const botConfig = config.bots.find(
    (bot) => bot.vk.groupId === req.body.group_id
  );
  if (!botConfig) {
    error("Wrong group id:", req.body.group_id);
    res.status(403).send("Unauthorized");
    return;
  }
  if (req.body.secret !== botConfig.vk.secret) {
    error("Wrong secret:", req.body.secret);
    res.status(403).send("Unauthorized");
    return;
  }
  if (req.body.type === "confirmation") {
    info("Confirmation");
    res.send(botConfig.vk.callbackString);
    return;
  }
  res.send("ok"); // vk waits for response 'ok'
  next();
  return;
}

module.exports = authMiddleware;
