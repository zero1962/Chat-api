import axios from 'axios';

export async function callGeminiAPI(userMessage) {
  const endpoint = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await axios.post(
      `${endpoint}?key=${apiKey}`,
      {
        contents: [
          {
            role: 'user',
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

    console.log('🌊 Geminiのレスポンス:', response.data);
    let reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Geminiが誤解して「一覧をください」と言った場合の再送処理
    if (
      reply.includes('ニュース一覧をご提示ください') ||
      reply.includes('URLや本文を教えてください') ||
      reply.includes('記事の内容が必要です')
    ) {
      const fallbackPrompt = `これはすでにニュース一覧です。以下の3件のニュースを日本語で簡潔に紹介してください。\n\n${userMessage}`;
      const fallbackResponse = await axios.post(
        `${endpoint}?key=${apiKey}`,
        {
          contents: [
            {
              role: 'user',
              parts: [{ text: fallbackPrompt }]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      reply = fallbackResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || 'うまく返事ができなかったみたい…💦';
    }

    return reply;
  } catch (error) {
    console.error('🌪️ Gemini API 呼び出しエラー:', error.message);
    return 'エラーが発生しちゃった…🌪️';
  }
}
