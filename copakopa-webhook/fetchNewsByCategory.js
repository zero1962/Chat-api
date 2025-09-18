import Parser from 'rss-parser';
import { callGeminiAPI } from './callGeminiAPI.js'; // Gemini翻訳・要約用

const parser = new Parser();

const categoryFeeds = {
  world: 'https://news.google.com/rss/headlines/section/topic/WORLD?hl=ja&gl=JP&ceid=JP:ja',
  business: 'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=ja&gl=JP&ceid=JP:ja',
  technology: 'https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=ja&gl=JP&ceid=JP:ja',
  sports: 'https://news.google.com/rss/headlines/section/topic/SPORTS?hl=ja&gl=JP&ceid=JP:ja',
  entertainment: 'https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=ja&gl=JP&ceid=JP:ja',
  health: 'https://news.google.com/rss/headlines/section/topic/HEALTH?hl=ja&gl=JP&ceid=JP:ja'
};

export async function fetchNewsByCategory(category = 'technology') {
  const feedUrl = categoryFeeds[category.toLowerCase()];
  if (!feedUrl) {
    return `カテゴリ「${category}」はサポートされていません。次のカテゴリから選んでください：${Object.keys(categoryFeeds).join(', ')}`;
  }

  try {
    const feed = await parser.parseURL(feedUrl);
    const topArticles = feed.items.slice(0, 3); // 上位3件を取得

    // Geminiに渡す要約用テキストを構築
    const summaryText = topArticles.map((item, index) => {
      return `【${index + 1}】${item.title}\n${item.link}`;
    }).join('\n\n');

    // Geminiで自然な日本語に整形
    const translated = await callGeminiAPI(`以下のニュース一覧を自然な日本語で要約してください:\n${summaryText}`);

    return translated || 'ニュースの要約に失敗しました…📰';
  } catch (error) {
    console.error('RSS取得エラー:', error.message);
    return 'ニュースの取得に失敗しました…💥';
  }
}
