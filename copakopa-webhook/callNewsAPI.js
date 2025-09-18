import axios from 'axios';
import { callGeminiAPI } from './callGeminiAPI.js'; // 翻訳用にGeminiを利用

export async function callNewsAPI(userMessage) {
  const endpoint = 'https://newsdata.io/api/1/news';
  const apiKey = process.env.NEWSDATA_API_KEY;

  try {
    const response = await axios.get(endpoint, {
      params: {
        apikey: apiKey,
        country: 'jp',         // 日本のニュース
        language: 'ja',        // 日本語指定
        category: 'top',       // トップニュース
        q: '日本',              // キーワード（任意）
        page: 1
      }
    });

    const articles = response.data.results;
    if (!articles || articles.length === 0) {
      return 'ニュースが見つかりませんでした…📰';
    }

    // 最初のニュース記事を取得
    const topArticle = articles[0];
    const title = topArticle.title || '';
    const description = topArticle.description || '';
    const link = topArticle.link || '';

    const summary = `${title}\n${description}\n🔗 ${link}`;

    // Geminiで自然な日本語に整形（翻訳不要ならこの処理は省略可能）
    const translated = await callGeminiAPI(`以下のニュースを自然な日本語で要約してください:\n${summary}`);

    return `📰 最新ニュース:\n${translated}`;
  } catch (error) {
    console.error('📰 NewsData.io APIエラー:', error.message);
    return 'ニュースの取得に失敗しました…💥';
  }
}
