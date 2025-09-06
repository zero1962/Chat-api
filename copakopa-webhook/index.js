require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { callGeminiAPI } = require('./callGeminiAPI');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const userMessage = req.body.queryResult.queryText;
  console.log('ユーザーのメッセージ:', userMessage);

  const geminiReply = await callGeminiAPI(userMessage);
  console.log('Geminiの返事:', geminiReply);

  res.json({
    fulfillmentText: geminiReply
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
