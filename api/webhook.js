// api/webhook.js　2025.09.10（Vercel対応・ESM形式）
console.log("🫧 Webhookバージョン: 2025.09.10-23:06");
import { callGeminiAPI } from '../copakopa-webhook/callGeminiAPI.js'; // 拡張子 .js を忘れずに！

const geminiIntents = [
  '雑談',
  '質問',
  'アイデア生成',
  'Default Fallback Intent'
];

export default async function handler(req, res) {
  console.log("🫧 Webhookバージョン: 2025.09.10-23:15");
  console.log("🫧 Webhookが呼ばれました！");
  console.log("🫧 リクエスト受信:", JSON.stringify(req.body, null, 2));

  const intentName = req.body.queryResult?.intent?.displayName;
  const userMessage = req.body.queryResult?.queryText;

  console.log("🫧 インテント名:", intentName);
  console.log("🫧 ユーザーのメッセージ:", userMessage);

  if (!geminiIntents.includes(intentName)) {
    console.log("🫧 Gemini に渡さないインテント。Dialogflow に任せます。");
    return res.status(204).end();
  }

  try {
    const geminiReply = await callGeminiAPI(userMessage);
    console.log("🫧 Geminiの返事:", geminiReply);

    res.json({
      fulfillmentText: geminiReply || 'うまく返事ができなかったみたい…💦'
    });
  } catch (error) {
    console.error("🫧 Webhookエラー:", error.message);
    res.json({
      fulfillmentText: 'エラーが発生しちゃった…💥'
    });
  }
}
