const { callGeminiAPI } = require('../copakopa-webhook/callGeminiAPI');

module.exports = async (req, res) => {
  const userMessage = req.body.queryResult?.queryText;

  if (!userMessage) {
    return res.status(400).json({ fulfillmentText: 'メッセージが見つからないよ〜💦' });
  }

  try {
    const reply = await callGeminiAPI(userMessage);
    console.log('Geminiの返事:', reply);

    res.json({
      fulfillmentText: reply
    });
  } catch (error) {
    console.error('Webhookエラー:', error);
    res.json({
      fulfillmentText: 'エラーが発生しちゃった…🌪️'
    });
  }
};
