// 재료 마스터 데이터 구조
export interface IngredientMaster {
  id: string;
  name: string;
  aliases: string[];
  category: string;
  synonyms_json?: Record<string, string[]>;
}

// 재료 카테고리 정의
export const ingredientCategories = {
  flour: ['밀가루', 'flour', '小麦粉'],
  rice: ['밥', 'rice', '米'],
  protein: {
    beef: ['소고기', 'beef', '牛肉'],
    pork: ['돼지고기', 'pork', '豚肉'],
    chicken: ['닭고기', 'chicken', '鶏肉'],
    fish: ['생선', 'fish', '魚'],
  },
  vegetables: [
    'onion', 'garlic', 'carrot', 'potato', 'tomato', 'cabbage',
    'spinach', 'mushroom', 'bellPepper', 'zucchini', 'greenOnion',
    'cucumber', 'lettuce',
  ],
  spices: [
    'salt', 'pepper', 'sugar', 'ginger', 'chiliPepper', 'sesame',
    'curry powder', 'paprika', 'cumin', 'turmeric',
  ],
  seasonings: [
    'soySauce', 'sesameOil', 'gochujang', 'doenjang', 'miso',
    'oysterSauce', 'ketchup', 'mayonnaise', 'vinegar', 'wine',
  ],
  fruits: ['apple', 'banana', 'lemon', 'orange'],
  other: ['egg', 'tofu', 'cheese', 'butter', 'milk', 'yogurt'],
};

// 카테고리 매핑
export const categoryMap: Record<string, string[]> = {
  flour: ingredientCategories.flour,
  rice: ingredientCategories.rice,
  protein: Object.values(ingredientCategories.protein).flat(),
  vegetables: ingredientCategories.vegetables,
  spices: ingredientCategories.spices,
  seasonings: ingredientCategories.seasonings,
  fruits: ingredientCategories.fruits,
  other: ingredientCategories.other,
};


