const axios = require('axios');

async function callGeminiAPI(userMessage) {
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent';
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await axios.post(
      `${endpoint}?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: userMessage }]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply || 'うまく返事ができなかったみたい…💦';
  } catch (error) {
    console.error('Gemini API 呼び出しエラー:', error.message);
    return 'エラーが発生しちゃった…🌪️';
  }
}

module.exports = { callGeminiAPI };
