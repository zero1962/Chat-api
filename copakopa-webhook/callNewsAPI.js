import Parser from 'rss-parser';
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
    return `カテゴリ「${category}」はサポートされていません。`;
  }

  try {
    const feed = await parser.parseURL(feedUrl);
    const topArticles = feed.items.slice(0, 5).map(item => {
      return `📰 ${item.title}\n🔗 ${item.link}`;
    });
    return topArticles.join('\n\n');
  } catch (error) {
    console.error('RSS取得エラー:', error.message);
    return 'ニュースの取得に失敗しました…💥';
  }
}
