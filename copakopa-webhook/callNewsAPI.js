import axios from 'axios';
import { callGeminiAPI } from './callGeminiAPI.js'; // 翻訳用にGeminiを利用

export async function callNewsAPI(userMessage) {
  const endpoint = 'https://newsapi.org/v2/top-headlines';
  const apiKey = process.env.NEWS_API_KEY;

  try {
    const response = await axios.get(endpoint, {
      params: {
        country: 'jp',         // 日本のニュース
        language: 'en',        // 日本語記事が少ないため英語指定
        pageSize: 5,           // 上位5件を取得
        q: 'Japan',            // キーワードで日本関連を強調
        apiKey: apiKey
      }
    });

    const articles = response.data.articles;
    if (!articles || articles.length === 0) {
      return 'ニュースが見つかりませんでした…📰';
    }

    // 最初のニュース記事を要約
    const topArticle = articles[0];
    const englishSummary = `${topArticle.title}\n${topArticle.description || ''}`;

    // Gemini APIで日本語に翻訳
    const translated = await callGeminiAPI(`以下のニュースを日本語に翻訳してください:\n${englishSummary}`);

    return `📰 最新ニュース:\n${translated}`;
  } catch (error) {
    console.error('📰 ニュースAPIエラー:', error.message);
    return 'ニュースの取得に失敗しました…💥';
  }
}
