// index.js の先頭に追加
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/webhook', async (req, res) => {
  const query = req.body.queryResult.queryText;
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

console.log("APIキー:", process.env.GEMINI_API_KEY);

  try {
    const result = await model.generateContent(query);
    const response = await result.response;
    const text = response.text();

    res.json({
      fulfillmentText: text,
    });
  } catch (error) {
    console.error('Error generating response:', error);
    res.json({
      fulfillmentText: 'ごめんね、うまく答えられなかったみたい…💦',
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
