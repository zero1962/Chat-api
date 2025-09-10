import dialogflow from "@google-cloud/dialogflow";

const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const projectId = process.env.GOOGLE_CLOUD_PROJECT;
const sessionId = "12345";
const languageCode = "ja-JP";

const sessionClient = new dialogflow.SessionsClient({
  credentials: {
    client_email: clientEmail,
    private_key: privateKey,
  },
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // const userMessage = req.body?.queryResult?.queryText;
  const userMessage =
    req.body?.queryResult?.queryText ||
    req.body?.queryResult?.text?.text?.[0] ||
    req.body?.queryResult?.fulfillmentMessages?.[0]?.text?.text?.[0];


  console.log("Dialogflowからのメッセージ:", userMessage);
  // console.log("🫧 process.env:", JSON.stringify(process.env, null, 2));
  console.log("🫧 Webhook受信:", JSON.stringify(req.body, null, 2));

  if (!userMessage) {
    res.status(400).json({ fulfillmentText: "メッセージが空です。" });
    return;
  }

try {
  console.log("🫧 detectIntent 実行前");

  const [response] = await sessionClient.detectIntent(request);

  console.log("🫧 detectIntent 実行後");

  const result = response.queryResult;
  console.log("🫧 queryResult:", JSON.stringify(result, null, 2));

  const reply =
    result.fulfillmentText ||
    result.fulfillmentMessages?.[0]?.text?.text?.[0] ||
    '返事が見つからなかったみたい…💦';

  console.log("Dialogflowからのメッセージ:", reply);

  res.status(200).json({ fulfillmentText: reply });
} catch (error) {
  console.error("🫧 Dialogflow API Error:", error);
  res.status(500).json({ fulfillmentText: "Dialogflowとの通信に失敗しました。" });
}

}
