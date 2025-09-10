const { callGeminiAPI } = require('../copakopa-webhook/callGeminiAPI');

module.exports = async (req, res) => {
  const intentName = req.body.queryResult?.intent?.displayName;
  const userMessage = req.body.queryResult?.queryText;
  console.log('🫧 インテント名:', intentName);
  console.log('🫧 ユーザーのメッセージ:', userMessage);
  console.log("🫧 受け取ったリクエスト:", JSON.stringify(req.body, null, 2));

  // Gemini に渡すインテント一覧（必要に応じて追加！）
  const geminiIntents = [
    '雑談',
    '質問',
    'アイデア生成',
    'Default Fallback Intent' // 登録されてないメッセージもここで拾う！
  ];

  // Gemini に渡さないインテント → Dialogflow に任せる
  if (!geminiIntents.includes(intentName)) {
    console.log('🛑 Gemini に渡さないインテント。Dialogflow に任せます。');
    return res.status(204).end(); // ← これが一番自然！
  }

  // Gemini に渡す処理
  try {
    const geminiReply = await callGeminiAPI(userMessage);
    console.log('🌊 Geminiの返事:', geminiReply);

    res.json({
      fulfillmentText: geminiReply || 'うまく返事ができなかったみたい…💦'
    });
  } catch (error) {
    console.error('🌪️ Webhookエラー:', error.message);
    res.json({
      fulfillmentText: 'エラーが発生しちゃった…🌪️'
    });
  }
};
