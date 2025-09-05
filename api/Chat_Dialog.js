// api/chat.js
import dialogflow from "@google-cloud/dialogflow";

// サービスアカウントキーへのパスを環境変数から取得
// ローカル環境では、GOOGLE_APPLICATION_CREDENTIALSにJSONファイルのパスを設定
// Vercelでは、環境変数に直接JSONの内容を設定するのが一般的
const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;

// DialogflowのプロジェクトID
// GCPプロジェクトIDに置き換えてください
const projectId = "gen-lang-client-067380249";

// セッションIDはユーザーごとに一意のIDを使用します
const sessionId = "12345"; // ユーザーを識別するID（セッション管理が必要）
const languageCode = "ja-JP";

// Dialogflowセッションクライアントを作成
const sessionClient = new dialogflow.SessionsClient({
  projectId: projectId,
  credentials: {
    client_email: clientEmail,
    private_key: privateKey,
  },
});

export default async function handler(req, res) {
  // CORSヘッダーとOPTIONSメソッドへの対応はそのまま
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

  // Dialogflowに送信するリクエストを作成
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
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

    // Dialogflowからの応答を取得
    const fulfillmentText = result.fulfillmentText;

    // クライアントに応答を返す
    res.status(200).json({
      text: fulfillmentText,
      // 必要に応じて、追加情報（例: インテント名）も返す
      intentDisplayName: result.intent.displayName,
    });
  } catch (error) {
    console.error("Dialogflow API Error:", error);
    res.status(500).json({ error: "Failed to communicate with Dialogflow API" });
  }
}