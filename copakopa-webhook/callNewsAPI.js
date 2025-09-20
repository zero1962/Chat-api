export async function callNewsAPI(userMessage) {
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

  // ✅ 部分一致でカテゴリを抽出
  let rawCategory = '';
  let category = 'general';
  for (const [jp, en] of Object.entries(categoryMap)) {
    if (userMessage.includes(jp)) {
      rawCategory = jp;
      category = en;
      break;
    }
  }

  // ✅ ログ出力で確認
  console.log('🧭 変換前カテゴリ:', rawCategory || '(一致なし)');
  console.log('🧭 変換後カテゴリ:', category);

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

    const prompt = `以下は「${rawCategory || category}」カテゴリのニュースです。日本語で簡潔に紹介してください。\n\n${summaries}`;
    const translated = await callGeminiAPI(prompt);
    const links = items.slice(0, 3).map((item) => `🔗 ${item.link}`).join('\n');

    return `📰 今日のニュース:\n${translated}\n\n${links}`;
  } catch (error) {
    console.error('📰 Google News RSS取得エラー:', error.message);
    return 'ニュースの取得に失敗しました…💥';
  }
}
