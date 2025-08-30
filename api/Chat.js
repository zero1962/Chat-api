// api/chat.js
export default async function handler(req, res) {
  // CORSヘッダーを追加
  res.setHeader("Access-Control-Allow-Origin", "http://zero1962b.world.coocan.jp/");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // OPTIONSメソッドへの対応（プリフライトリクエスト）
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { message } = req.body;

  const response = await fetch(
  "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: message }
          ]
        }
      ]
    })
  }
);


  const data = await response.json();
  res.status(200).json(data);
}
