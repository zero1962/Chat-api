require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const webhookHandler = require('./webhook'); // ← ここがポイント！

const app = express();
app.use(bodyParser.json());

app.post('/webhook', webhookHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
