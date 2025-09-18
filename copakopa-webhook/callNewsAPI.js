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

    // 最初のニュース記事を取得
    const topItem = items[0];
    const title = topItem.title || '';
    const description = topItem.description || '';
    const link = topItem.link || '';

    const summary = `${title}\n${description}\n🔗 ${link}`;

    // Geminiで自然な日本語に整形（翻訳＋要約）
    const translated = await callGeminiAPI(`以下のニュースを自然な日本語で要約してください:\n${summary}`);

    return `📰 最新ニュース:\n${translated}`;
  } catch (error) {
    console.error('📰 Google News RSS取得エラー:', error.message);
    return 'ニュースの取得に失敗しました…💥';
  }
}
