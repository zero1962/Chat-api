// api/chat_Dialog.js
import dialogflow from "@google-cloud/dialogflow";

// サービスアカウントキーへのパスを環境変数から取得
const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
// DialogflowのプロジェクトID "gen-lang-client-067380249"
const projectId = process.env.GOOGLE_PROJECT_ID;

// セッションIDはユーザーごとに一意のIDを使用します
const sessionId = "12345";
const languageCode = "ja-JP";

// Dialogflowセッションクライアントを作成（projectIdは渡さない）
const sessionClient = new dialogflow.SessionsClient({
  credentials: {
    client_email: clientEmail,
    private_key: privateKey,
  },
});

export default async function handler(req, res) {
  // CORSヘッダーとOPTIONSメソッドへの対応
  res.setHeader("Access-Control-Allow-Origin", "http://zero1962b.world.coocan.jp");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // ユーザーからのメッセージを取得
  const { message } = req.body;

  // ??セッションパスをここで作成！
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  // Dialogflowに送信するリクエストを作成
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: languageCode,
      },
    },
  };

  try {
    // Dialogflow APIを呼び出し
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    // クライアントに応答を返す
    res.status(200).json({
      text: result.fulfillmentText,
      intentDisplayName: result.intent.displayName,
    });
  } catch (error) {
    console.error("Dialogflow API Error:", error);
    res.status(500).json({ error: "Failed to communicate with Dialogflow API" });
  }
}
