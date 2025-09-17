import axios from 'axios';

export async function callWeatherAPI(userMessage) {
  const endpoint = 'https://api.openweathermap.org/data/2.5/weather';
  const apiKey = 'eca9b7bf55513e81fbb41548a9b776c1'; // ← 本番では環境変数に戻してください

  const cityMatch = userMessage.match(/(東京|大阪|名古屋|札幌|福岡|京都)/);
  const city = cityMatch ? cityMatch[1] : '東京';

  console.log('🌆 抽出された都市名:', city);

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
    const reply = `${city}の現在の天気は「${weather}」、気温は約${temp}℃です。`;

    console.log('🌤️ 天気APIの返事:', reply);
    return reply;
  } catch (error) {
    console.error('🌪️ 天気API 呼び出しエラー:', error.message);
    return '天気情報の取得に失敗しました…🌪️';
  }
}
