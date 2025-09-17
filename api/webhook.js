import { callGeminiAPI } from '../copakopa-webhook/callGeminiAPI.js';
import { callWeatherAPI } from '../copakopa-webhook/callWeatherAPI.js'; // 天気API用の関数を追加

console.log("🫧 Webhookバージョン: 2025.09.11-17:46");

const geminiIntents = [
  '雑談',
  '質問',
  'アイデア生成',
  'Default Fallback Intent'
];

export default async function handler(req, res) {
  console.log("🫧 Webhookが呼ばれました！");
  console.log("🫧 リクエスト受信:", JSON.stringify(req.body, null, 2));

  const intentName = req.body.queryResult?.intent?.displayName;
  const userMessage = req.body.queryResult?.queryText;

  console.log("🫧 インテント名:", intentName);
  console.log("🫧 ユーザーのメッセージ:", userMessage);

  try {
    if (geminiIntents.includes(intentName)) {
      const geminiReply = await callGeminiAPI(userMessage);
      console.log("🫧 Geminiの返事:", geminiReply);

      return res.json({
        fulfillmentText: geminiReply || 'うまく返事ができなかったみたい…💦'
      });
    }

    if (intentName === 'WeatherIntent') {
      const weatherReply = await callWeatherAPI(userMessage);
      console.log("🫧 天気APIの返事:", weatherReply);

      return res.json({
        fulfillmentText: weatherReply || '天気情報が取得できなかったみたい…☁️'
      });
    }

    console.log("🫧 対応するインテントが見つかりません。Dialogflow に任せます。");
    return res.status(204).end();

  } catch (error) {
    console.error("🫧 Webhookエラー:", error.message);
    res.json({
      fulfillmentText: 'エラーが発生しちゃった…💥'
    });
  }
}
