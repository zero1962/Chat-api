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

  const userMessage = req.body?.queryResult?.queryText;

  console.log("Dialogflowからのメッセージ:", userMessage);
  console.log("🫧 process.env:", JSON.stringify(process.env, null, 2));

  if (!userMessage) {
    res.status(400).json({ fulfillmentText: "メッセージが空です。" });
    return;
  }

  try {
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: userMessage,
          languageCode: languageCode,
        },
      },
    };

    const [response] = await sessionClient.detectIntent(request);
    // const result = response.queryResult;
    const result = response.queryResult;
    const reply =
      result.fulfillmentText || '返事が見つからなかったみたい…💦';
    console.log("Dialogflowからのメッセージ:", reply);
    console.log("🫧 process.env:", JSON.stringify(process.env, null, 2));

    res.status(200).json({
      fulfillmentText: reply
    });

  } catch (error) {
    console.error("Dialogflow API Error:", error);
    res.status(500).json({
      fulfillmentText: "Dialogflowとの通信に失敗しました。"
    });
  }
}
