const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Telegram = require('node-telegram-bot-api');
const { vkConfirmation, vkNewPostHandler } = require('./utils');
const {
  functions: { test: config },
} = require('./config');

const app = express();

app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/', (req, res) => {
  vkConfirmation(req, res);
  const telegram = new Telegram(config.telegram.botToken);
  vkNewPostHandler(req, res, config, telegram);

  res.send('ok');
});

module.exports = app;
