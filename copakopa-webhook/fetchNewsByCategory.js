import Parser from 'rss-parser';
import { callGeminiAPI } from './callGeminiAPI.js';

const parser = new Parser();

// ✅ 日本語 → 英語カテゴリ変換マップを追加
const categoryMap = {
  'スポーツ': 'sports',
  'テクノロジー': 'technology',
  '技術': 'technology',
  'ビジネス': 'business',
  '経済': 'business',
  '世界': 'world',
  '国際': 'world',
  'エンタメ': 'entertainment',
  '芸能': 'entertainment',
  '映画': 'entertainment',
  '音楽': 'entertainment',
  '健康': 'health',
  '医療': 'health',
  '政治': 'world' // Gemini対策
};

const categoryFeeds = {
  world: 'https://news.google.com/rss/headlines/section/topic/WORLD?hl=ja&gl=JP&ceid=JP:ja',
  business: 'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=ja&gl=JP&ceid=JP:ja',
  technology: 'https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=ja&gl=JP&ceid=JP:ja',
  sports: 'https://news.google.com/rss/headlines/section/topic/SPORTS?hl=ja&gl=JP&ceid=JP:ja',
  entertainment: 'https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=ja&gl=JP&ceid=JP:ja',
  health: 'https://news.google.com/rss/headlines/section/topic/HEALTH?hl=ja&gl=JP&ceid=JP:ja'
};

export async function fetchNewsByCategory(category = 'technology') {
  // ✅ 日本語カテゴリを英語に変換（完全一致）
  const rawCategory = category.trim();
  const englishCategory = categoryMap[rawCategory] || rawCategory.toLowerCase();

  console.log('🧭 変換前カテゴリ:', rawCategory);
  console.log('🧭 変換後カテゴリ:', englishCategory);

  const feedUrl = categoryFeeds[englishCategory];
  if (!feedUrl) {
    return `カテゴリ「${rawCategory}」はサポートされていません。次のカテゴリから選んでください：${Object.keys(categoryFeeds).join(', ')}`;
  }

  try {
    const feed = await parser.parseURL(feedUrl);
    const topArticles = feed.items.slice(0, 3);

    const summaryText = topArticles.map((item, index) => {
      return `【${index + 1}】${item.title}\n${item.link}`;
    }).join('\n\n');

    const translated = await callGeminiAPI(`以下は「${rawCategory}」カテゴリのニュース一覧です。自然な日本語で要約してください:\n${summaryText}`);

    return translated || 'ニュースの要約に失敗しました…📰';
  } catch (error) {
    console.error('RSS取得エラー:', error.message);
    return 'ニュースの取得に失敗しました…💥';
  }
}
