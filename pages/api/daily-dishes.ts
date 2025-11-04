import type { NextApiRequest, NextApiResponse } from 'next';

// 오늘의 추천 요리 후보 목록
const DAILY_DISHES = {
  korean: [
    '김치찌개 (Kimchi Jjigae)',
    '비빔밥 (Bibimbap)',
    '불고기 (Bulgogi)',
    '삼계탕 (Samgyetang)',
    '잡채 (Japchae)',
    '된장찌개 (Doenjang Jjigae)',
    '갈비찜 (Galbijjim)',
    '떡볶이 (Tteokbokki)',
    '순두부찌개 (Sundubu Jjigae)',
    '해물파전 (Haemul Pajeon)',
  ],
  japanese: [
    'とんかつ (Tonkatsu)',
    'ラーメン (Ramen)',
    '親子丼 (Oyakodon)',
    '天ぷら (Tempura)',
    'カレーライス (Curry Rice)',
    'すき焼き (Sukiyaki)',
    'お好み焼き (Okonomiyaki)',
    '焼き鳥 (Yakitori)',
    'うどん (Udon)',
    '寿司 (Sushi)',
  ],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cuisineType, exclude } = req.query;
    
    let dishes: string[] = [];
    if (cuisineType === 'korean') {
      dishes = DAILY_DISHES.korean;
    } else if (cuisineType === 'japanese') {
      dishes = DAILY_DISHES.japanese;
    } else {
      dishes = [...DAILY_DISHES.korean, ...DAILY_DISHES.japanese];
    }

    // 이전에 추천된 요리 제외
    if (exclude && typeof exclude === 'string') {
      const excludeList = exclude.split(',');
      dishes = dishes.filter(dish => !excludeList.includes(dish));
    }

    // 랜덤으로 하나 선택
    const randomDish = dishes[Math.floor(Math.random() * dishes.length)];

    return res.status(200).json({
      dish: randomDish,
      cuisineType: cuisineType || 'mixed',
    });
  } catch (error) {
    console.error('Error getting daily dish:', error);
    return res.status(500).json({ error: 'Failed to get daily dish' });
  }
}








