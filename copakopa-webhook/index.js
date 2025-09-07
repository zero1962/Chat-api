require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const webhookHandler = require('./webhook');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', webhookHandler);

// listenは削除！代わりにエクスポート！
module.exports = app;
