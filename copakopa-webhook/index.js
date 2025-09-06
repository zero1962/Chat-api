// index.js の先頭に追加
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const { callGeminiAPI } = require('./gemini'); // ← さっき作ったやつ！
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/webhook', async (req, res) => {
  const userMessage = req.body.queryResult.queryText;
  console.log('ユーザーのメッセージ:', userMessage);
 
  const geminiReply = await callGeminiAPI(userMessage);
  console.log('Geminiの返事:', geminiReply);

  res.json({
    fulfillmentText: geminiReply
  });
});

app.listen(3000, () => {
  console.log('Webhook server is running on port 3000');
});
