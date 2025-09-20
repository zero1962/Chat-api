import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { callGeminiAPI } from './callGeminiAPI.js';

export async function callNewsAPI(category) {
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(category)}&hl=ja&gl=JP&ceid=JP:ja`;

  try {
    const rssResponse = await axios.get(rssUrl);
    const parser = new XMLParser();
    const parsed = parser.parse(rssResponse.data);

    const items = parsed.rss?.channel?.item;
    if (!items || items.length === 0) {
      return 'ニュースが見つかりませんでした…📰';
    }

    const summaries = items.slice(0, 3).map((item, index) => {
      const title = item.title || '';
      const description = item.description || '';
      return `【${index + 1}】${title}\n${description}`;
    }).join('\n\n');

    const prompt = `以下は「${category}」カテゴリのニュースです。日本語で簡潔に紹介してください。\n\n${summaries}`;
    const translated = await callGeminiAPI(prompt);
    const links = items.slice(0, 3).map((item) => `🔗 ${item.link}`).join('\n');

    return `📰 今日のニュース:\n${translated}\n\n${links}`;
  } catch (error) {
    console.error('📰 Google News RSS取得エラー:', error.message);
    return 'ニュースの取得に失敗しました…💥';
  }
}
