const config = require('../config');

module.exports = (req, res) => {
  if (req.body.secret !== config.functions.test.vk.secretKey) {
    req.send('wrong secret');
  }
  if (
    req.body.type == 'confirmation' &&
    req.body.group_id == config.functions.test.vk.groupId
  ) {
    res.send(config.functions.test.vk.callbackConfirmationString);
    return;
  }
};
