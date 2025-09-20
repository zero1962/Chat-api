import axios from 'axios';
import { XMLParser } from 'fast-xml-parser'; // RSS解析用
import { callGeminiAPI } from './callGeminiAPI.js'; // 翻訳・整形用

export async function callNewsAPI(userMessage) {
  const rssUrl = 'https://news.google.com/rss/search?q=最新ニュース&hl=ja&gl=JP&ceid=JP:ja';

  try {
    const rssResponse = await axios.get(rssUrl);
    const parser = new XMLParser();
    const parsed = parser.parse(rssResponse.data);

    const items = parsed.rss?.channel?.item;
    if (!items || items.length === 0) {
      return 'ニュースが見つかりませんでした…📰';
    }

    // 上位3件のニュースを取得して整形
    const summaries = items.slice(0, 3).map((item, index) => {
      const title = item.title || '';
      const description = item.description || '';
      const link = item.link || '';
      return `【${index + 1}】${title}\n${description}`;
    }).join('\n\n');

    const prompt = `以下の3件のニュースを簡潔に紹介してください。日本語で自然にまとめてください。\n\n${summaries}`;

    // Geminiで自然な日本語に整形（翻訳＋要約）
    const translated = await callGeminiAPI(prompt);

    // 最初のリンクだけ紹介（必要なら複数リンクも可能）
    const links = items.slice(0, 3).map((item, index) => `🔗 ${item.link}`).join('\n');

    return `📰 今日のニュース:\n${translated}\n\n${links}`;
  } catch (error) {
    console.error('📰 Google News RSS取得エラー:', error.message);
    return 'ニュースの取得に失敗しました…💥';
  }
}
