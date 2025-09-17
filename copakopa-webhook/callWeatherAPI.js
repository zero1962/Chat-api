// copakopa-webhook/callWeatherAPI.js
import axios from 'axios';

export async function callWeatherAPI(userMessage) {
  const endpoint = 'https://api.openweathermap.org/data/2.5/weather';
  const apiKey = process.env.OPENWEATHER_API_KEY;

  const cityMap = {
    '東京': 'Tokyo',
    '大阪': 'Osaka',
    '名古屋': 'Nagoya',
    '札幌': 'Sapporo',
    '福岡': 'Fukuoka',
    '京都': 'Kyoto'
  };

  const cityMatch = userMessage.match(/(東京|大阪|名古屋|札幌|福岡|京都)/);
  const cityJa = cityMatch ? cityMatch[1] : '東京';
  const city = cityMap[cityJa] || 'Tokyo';

  console.log('🌆 抽出された都市名:', cityJa);
  console.log('🌍 APIに渡す都市名:', city);

  try {
    const response = await axios.get(endpoint, {
      params: {
        q: city,
        appid: apiKey,
        lang: 'ja',
        units: 'metric'
      }
    });

    const weather = response.data.weather?.[0]?.description || '不明';
    const temp = response.data.main?.temp;
    const reply = `${cityJa}の現在の天気は「${weather}」、気温は約${temp}℃です。`;

    console.log('🌤️ 天気APIの返事:', reply);
    return reply;
  } catch (error) {
    console.error('🌪️ 天気API 呼び出しエラー:', error.message);
    return '天気情報の取得に失敗しました…🌪️';
  }
}
