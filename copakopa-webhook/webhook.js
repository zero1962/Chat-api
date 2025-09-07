const { callGeminiAPI } = require('../callGeminiAPI');

module.exports = async (req, res) => {
  const userMessage = req.body.queryResult?.queryText;
  console.log('ユーザーのメッセージ:', userMessage);

  try {
    const geminiReply = await callGeminiAPI(userMessage);
    console.log('Geminiの返事:', geminiReply);

    res.json({
      fulfillmentText: geminiReply
    });
  } catch (error) {
    console.error('Webhookエラー:', error);
    res.json({
      fulfillmentText: 'エラーが発生しちゃった…🌪️'
    });
  }
};
