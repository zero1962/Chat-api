import { callGeminiAPI } from '../copakopa-webhook/callGeminiAPI.js';
import { callWeatherAPI } from '../copakopa-webhook/callWeatherAPI.js';
import { callNewAPI } from '../copakopa-webhook/callNewAPI.js'; // 🆕 ニュースAPI用の関数を追加

console.log("🫧 Webhookバージョン: 2025.09.18-13:15");

const geminiIntents = [
  '雑談',
  '質問',
  'アイデア生成',
  'Default Fallback Intent'
];

const weatherIntents = [
  'WeatherIntent'
];

const newsIntents = [
  'NewsIntent', // 🆕 Dialogflow側で「ニュースを聞く」などに対応するインテント名
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

    if (weatherIntents.includes(intentName)) {
      const weatherReply = await callWeatherAPI(userMessage);
      console.log("🫧 天気APIの返事:", weatherReply);

      return res.json({
        fulfillmentText: weatherReply || '天気情報が取得できなかったみたい…☁️'
      });
    }

    if (newsIntents.includes(intentName)) {
      const newsReply = await callNewAPI(userMessage);
      console.log("🫧 ニュースAPIの返事:", newsReply);

      return res.json({
        fulfillmentText: newsReply || 'ニュースが取得できなかったみたい…📰'
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
