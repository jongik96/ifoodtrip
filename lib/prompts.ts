import { Country, Locale } from '@/types/database';
import { RecipeFilters } from '@/types/recipe';

// 국가별 프롬프트 템플릿
export function generateRecipePrompt(
  country: Country,
  filters: RecipeFilters,
  locale: Locale
): { system: string; user: string } {
  const localeMap: Record<Locale, string> = {
    ko: '한국어',
    ja: '日本語',
    en: 'English',
    fr: 'Français',
  };

  const countryMap: Record<Country, string> = {
    korea: locale === 'ko' ? '한국' : locale === 'ja' ? '韓国' : locale === 'fr' ? 'Corée' : 'Korea',
    japan: locale === 'ko' ? '일본' : locale === 'ja' ? '日本' : locale === 'fr' ? 'Japon' : 'Japan',
    spain: locale === 'ko' ? '스페인' : locale === 'ja' ? 'スペイン' : locale === 'fr' ? 'Espagne' : 'Spain',
    italy: locale === 'ko' ? '이탈리아' : locale === 'ja' ? 'イタリア' : locale === 'fr' ? 'Italie' : 'Italy',
    india: locale === 'ko' ? '인도' : locale === 'ja' ? 'インド' : locale === 'fr' ? 'Inde' : 'India',
    turkey: locale === 'ko' ? '터키' : locale === 'ja' ? 'トルコ' : locale === 'fr' ? 'Turquie' : 'Turkey',
  };

  const systemPrompt = `You are a professional chef and nutritionist specializing in ${countryMap[country]} cuisine. You generate cooking recipes as Markdown. Follow this template EXACTLY. Use locale ${localeMap[locale]}. If user lists ingredients, use only those. Suggest up to 3 substitutes per missing essential ingredient. Respect allergies. Output sections: Title, Meta(country, servings, time, difficulty), Ingredients(list with amounts), Steps(numbered), Nutrition(approx), Tips. No extra text outside sections.`;

  let userPrompt = `Country: ${countryMap[country]}\n`;
  userPrompt += `Ingredients: ${filters.ingredients?.join(', ') || 'any'}\n`;
  userPrompt += `Servings: ${filters.servings || 2}\n`;
  
  if (filters.maxTime) {
    userPrompt += `TimeLimit: ${filters.maxTime} minutes\n`;
  }
  
  if (filters.difficulty) {
    userPrompt += `Difficulty: ${filters.difficulty}\n`;
  }
  
  if (filters.allergies && filters.allergies.length > 0) {
    userPrompt += `Allergies: ${filters.allergies.join(', ')}\n`;
  }

  // 각 언어별 마크다운 템플릿
  const templateMap = {
    ko: {
      header: `# {요리 제목}\n**국가**: {country} • **인분**: {servings} • **시간**: {minutes}분 • **난이도**: {difficulty}\n\n## 재료\n- 재료명 (수량)\n\n## 조리 단계\n1. 단계...\n2. 단계...\n\n## 영양정보 (대략)\n- 칼로리: xxx kcal\n- 단백질: xx g\n\n## 팁\n- 알레르기 대체재...`,
    },
    ja: {
      header: `# {料理タイトル}\n**国**: {country} • **人数**: {servings} • **時間**: {minutes}分 • **難易度**: {difficulty}\n\n## 材料\n- 材料名 (分量)\n\n## 作り方\n1. ステップ...\n2. ステップ...\n\n## 栄養情報（大体）\n- カロリー: xxx kcal\n- タンパク質: xx g\n\n## ヒント\n- アレルギー代替品...`,
    },
    en: {
      header: `# {Dish Title}\n**Country**: {country} • **Servings**: {servings} • **Time**: {minutes}min • **Difficulty**: {difficulty}\n\n## Ingredients\n- Ingredient name (amount)\n\n## Instructions\n1. Step...\n2. Step...\n\n## Nutrition (Approx)\n- Calories: xxx kcal\n- Protein: xx g\n\n## Tips\n- Allergy substitutes...`,
    },
    fr: {
      header: `# {Titre du Plat}\n**Pays**: {country} • **Portions**: {servings} • **Temps**: {minutes}min • **Difficulté**: {difficulty}\n\n## Ingrédients\n- Nom de l'ingrédient (quantité)\n\n## Instructions\n1. Étape...\n2. Étape...\n\n## Nutrition (Approx)\n- Calories: xxx kcal\n- Protéines: xx g\n\n## Conseils\n- Substituts d'allergie...`,
    },
  };

  userPrompt += `\nGenerate a recipe in ${localeMap[locale]} following this EXACT Markdown format:\n\n`;
  userPrompt += templateMap[locale].header;

  return { system: systemPrompt, user: userPrompt };
}

// Few-shot 예시 포함 프롬프트
export function generateRecipePromptWithExamples(
  country: Country,
  filters: RecipeFilters,
  locale: Locale
): { system: string; user: string } {
  const basePrompt = generateRecipePrompt(country, filters, locale);
  
  // Few-shot 예시 추가 (간단한 예시만 포함)
  const example = getExampleRecipe(country, locale);
  
  basePrompt.user += `\n\nExample output:\n${example}`;
  
  return basePrompt;
}

function getExampleRecipe(country: Country, locale: Locale): string {
  // 간단한 예시 레시피 반환 (완전한 다국어)
  const examples: Record<Country, Record<Locale, string>> = {
    korea: {
      ko: `# 김치볶음밥\n**국가**: 한국 • **인분**: 2 • **시간**: 15분 • **난이도**: 쉬움\n\n## 재료\n- 밥 2공기\n- 김치 100g\n- 계란 2개\n- 참기름 1큰술\n\n## 조리 단계\n1. 팬에 참기름 두르고 김치 볶기\n2. 밥 넣고 볶기\n3. 계란 넣어 스크램블\n\n## 영양정보 (대략)\n- 칼로리: 350 kcal\n- 단백질: 12g`,
      ja: `# キムチチャーハン\n**国**: 韓国 • **人数**: 2 • **時間**: 15分 • **難易度**: 簡単\n\n## 材料\n- ご飯 2杯\n- キムチ 100g\n- 卵 2個\n- ごま油 大さじ1\n\n## 作り方\n1. フライパンにごま油をひいてキムチを炒める\n2. ご飯を入れて炒める\n3. 卵を入れてスクランブル\n\n## 栄養情報（大体）\n- カロリー: 350 kcal\n- タンパク質: 12g`,
      en: `# Kimchi Fried Rice\n**Country**: Korea • **Servings**: 2 • **Time**: 15min • **Difficulty**: Easy\n\n## Ingredients\n- Cooked rice 2 servings\n- Kimchi 100g\n- Eggs 2\n- Sesame oil 1 tbsp\n\n## Instructions\n1. Heat sesame oil in pan and stir-fry kimchi\n2. Add rice and stir-fry\n3. Add eggs and scramble\n\n## Nutrition (Approx)\n- Calories: 350 kcal\n- Protein: 12g`,
      fr: `# Riz Frit au Kimchi\n**Pays**: Corée • **Portions**: 2 • **Temps**: 15min • **Difficulté**: Facile\n\n## Ingrédients\n- Riz cuit 2 portions\n- Kimchi 100g\n- Oeufs 2\n- Huile de sésame 1 c. à soupe\n\n## Instructions\n1. Chauffez l'huile de sésame dans une poêle et faites revenir le kimchi\n2. Ajoutez le riz et faites revenir\n3. Ajoutez les oeufs et brouillez\n\n## Nutrition (Approx)\n- Calories: 350 kcal\n- Protéines: 12g`,
    },
    japan: {
      ko: `# 오야코동\n**국가**: 일본 • **인분**: 2 • **시간**: 20분 • **난이도**: 쉬움\n\n## 재료\n- 닭고기 200g\n- 계란 4개\n- 양파 1개\n- 밥 2공기\n\n## 조리 단계\n1. 팬에 닭고기 볶기\n2. 계란 풀어 넣기\n3. 밥 위에 올리기\n\n## 영양정보 (대략)\n- 칼로리: 550 kcal\n- 단백질: 35g`,
      ja: `# 親子丼\n**国**: 日本 • **人数**: 2 • **時間**: 20分 • **難易度**: 簡単\n\n## 材料\n- 鶏肉 200g\n- 卵 4個\n- 玉ねぎ 1個\n- ご飯 2杯\n\n## 作り方\n1. フライパンで鶏肉を炒める\n2. 卵を割り入れる\n3. ご飯の上にのせる\n\n## 栄養情報（大体）\n- カロリー: 550 kcal\n- タンパク質: 35g`,
      en: `# Oyakodon\n**Country**: Japan • **Servings**: 2 • **Time**: 20min • **Difficulty**: Easy\n\n## Ingredients\n- Chicken 200g\n- Eggs 4\n- Onion 1\n- Cooked rice 2 servings\n\n## Instructions\n1. Stir-fry chicken in pan\n2. Pour in beaten eggs\n3. Serve over rice\n\n## Nutrition (Approx)\n- Calories: 550 kcal\n- Protein: 35g`,
      fr: `# Oyakodon\n**Pays**: Japon • **Portions**: 2 • **Temps**: 20min • **Difficulté**: Facile\n\n## Ingrédients\n- Poulet 200g\n- Oeufs 4\n- Oignon 1\n- Riz cuit 2 portions\n\n## Instructions\n1. Faites revenir le poulet dans une poêle\n2. Versez les oeufs battus\n3. Servez sur le riz\n\n## Nutrition (Approx)\n- Calories: 550 kcal\n- Protéines: 35g`,
    },
    spain: {
      ko: `# 파에야\n**국가**: 스페인 • **인분**: 4 • **시간**: 45분 • **난이도**: 중간\n\n## 재료\n- 쌀 400g\n- 새우 200g\n- 홍합 200g\n- 토마토 2개\n\n## 조리 단계\n1. 재료 볶기\n2. 쌀과 육수 넣기\n3. 20분 끓이기\n\n## 영양정보 (대략)\n- 칼로리: 420 kcal\n- 단백질: 25g`,
      ja: `# パエリア\n**国**: スペイン • **人数**: 4 • **時間**: 45分 • **難易度**: 普通\n\n## 材料\n- 米 400g\n- エビ 200g\n- ムール貝 200g\n- トマト 2個\n\n## 作り方\n1. 材料を炒める\n2. 米とスープを入れる\n3. 20分煮る\n\n## 栄養情報（大体）\n- カロリー: 420 kcal\n- タンパク質: 25g`,
      en: `# Paella\n**Country**: Spain • **Servings**: 4 • **Time**: 45min • **Difficulty**: Medium\n\n## Ingredients\n- Rice 400g\n- Shrimp 200g\n- Mussels 200g\n- Tomatoes 2\n\n## Instructions\n1. Stir-fry ingredients\n2. Add rice and stock\n3. Simmer for 20 minutes\n\n## Nutrition (Approx)\n- Calories: 420 kcal\n- Protein: 25g`,
      fr: `# Paella\n**Pays**: Espagne • **Portions**: 4 • **Temps**: 45min • **Difficulté**: Moyen\n\n## Ingrédients\n- Riz 400g\n- Crevettes 200g\n- Moules 200g\n- Tomates 2\n\n## Instructions\n1. Faites revenir les ingrédients\n2. Ajoutez le riz et le bouillon\n3. Laissez mijoter 20 minutes\n\n## Nutrition (Approx)\n- Calories: 420 kcal\n- Protéines: 25g`,
    },
    italy: {
      ko: `# 토마토 파스타\n**국가**: 이탈리아 • **인분**: 2 • **시간**: 25분 • **난이도**: 쉬움\n\n## 재료\n- 파스타 200g\n- 토마토 3개\n- 올리브유 2큰술\n- 마늘 2쪽\n\n## 조리 단계\n1. 파스타 삶기\n2. 토마토 소스 만들기\n3. 함께 볶기\n\n## 영양정보 (대략)\n- 칼로리: 380 kcal\n- 단백질: 15g`,
      ja: `# トマトパスタ\n**国**: イタリア • **人数**: 2 • **時間**: 25分 • **難易度**: 簡単\n\n## 材料\n- パスタ 200g\n- トマト 3個\n- オリーブオイル 大さじ2\n- にんにく 2片\n\n## 作り方\n1. パスタを茹でる\n2. トマトソースを作る\n3. 一緒に炒める\n\n## 栄養情報（大体）\n- カロリー: 380 kcal\n- タンパク質: 15g`,
      en: `# Tomato Pasta\n**Country**: Italy • **Servings**: 2 • **Time**: 25min • **Difficulty**: Easy\n\n## Ingredients\n- Pasta 200g\n- Tomatoes 3\n- Olive oil 2 tbsp\n- Garlic 2 cloves\n\n## Instructions\n1. Boil pasta\n2. Make tomato sauce\n3. Stir-fry together\n\n## Nutrition (Approx)\n- Calories: 380 kcal\n- Protein: 15g`,
      fr: `# Pâtes à la Tomate\n**Pays**: Italie • **Portions**: 2 • **Temps**: 25min • **Difficulté**: Facile\n\n## Ingrédients\n- Pâtes 200g\n- Tomates 3\n- Huile d'olive 2 c. à soupe\n- Ail 2 gousses\n\n## Instructions\n1. Faites cuire les pâtes\n2. Préparez la sauce tomate\n3. Faites revenir ensemble\n\n## Nutrition (Approx)\n- Calories: 380 kcal\n- Protéines: 15g`,
    },
    india: {
      ko: `# 커리\n**국가**: 인도 • **인분**: 4 • **시간**: 40분 • **난이도**: 중간\n\n## 재료\n- 닭고기 500g\n- 커리파우더 2큰술\n- 양파 2개\n- 코코넛밀크 200ml\n\n## 조리 단계\n1. 향신료 볶기\n2. 고기 넣고 볶기\n3. 코코넛밀크 넣고 끓이기\n\n## 영양정보 (대략)\n- 칼로리: 320 kcal\n- 단백질: 28g`,
      ja: `# カレー\n**国**: インド • **人数**: 4 • **時間**: 40分 • **難易度**: 普通\n\n## 材料\n- 鶏肉 500g\n- カレーパウダー 大さじ2\n- 玉ねぎ 2個\n- ココナッツミルク 200ml\n\n## 作り方\n1. スパイスを炒める\n2. 肉を入れて炒める\n3. ココナッツミルクを入れて煮る\n\n## 栄養情報（大体）\n- カロリー: 320 kcal\n- タンパク質: 28g`,
      en: `# Curry\n**Country**: India • **Servings**: 4 • **Time**: 40min • **Difficulty**: Medium\n\n## Ingredients\n- Chicken 500g\n- Curry powder 2 tbsp\n- Onions 2\n- Coconut milk 200ml\n\n## Instructions\n1. Roast spices\n2. Add meat and stir-fry\n3. Add coconut milk and simmer\n\n## Nutrition (Approx)\n- Calories: 320 kcal\n- Protein: 28g`,
      fr: `# Curry\n**Pays**: Inde • **Portions**: 4 • **Temps**: 40min • **Difficulté**: Moyen\n\n## Ingrédients\n- Poulet 500g\n- Poudre de curry 2 c. à soupe\n- Oignons 2\n- Lait de coco 200ml\n\n## Instructions\n1. Faites torréfier les épices\n2. Ajoutez la viande et faites revenir\n3. Ajoutez le lait de coco et laissez mijoter\n\n## Nutrition (Approx)\n- Calories: 320 kcal\n- Protéines: 28g`,
    },
    turkey: {
      ko: `# 케밥\n**국가**: 터키 • **인분**: 2 • **시간**: 30분 • **난이도**: 중간\n\n## 재료\n- 양고기 300g\n- 양파 1개\n- 피망 2개\n- 요구르트 100ml\n\n## 조리 단계\n1. 고기 양념하기\n2. 꼬치에 꽂기\n3. 그릴에서 굽기\n\n## 영양정보 (대략)\n- 칼로리: 280 kcal\n- 단백질: 35g`,
      ja: `# ケバブ\n**国**: トルコ • **人数**: 2 • **時間**: 30分 • **難易度**: 普通\n\n## 材料\n- 羊肉 300g\n- 玉ねぎ 1個\n- ピーマン 2個\n- ヨーグルト 100ml\n\n## 作り方\n1. 肉に味をつける\n2. 串に刺す\n3. グリルで焼く\n\n## 栄養情報（大体）\n- カロリー: 280 kcal\n- タンパク質: 35g`,
      en: `# Kebab\n**Country**: Turkey • **Servings**: 2 • **Time**: 30min • **Difficulty**: Medium\n\n## Ingredients\n- Lamb 300g\n- Onion 1\n- Bell peppers 2\n- Yogurt 100ml\n\n## Instructions\n1. Marinate meat\n2. Skewer on sticks\n3. Grill\n\n## Nutrition (Approx)\n- Calories: 280 kcal\n- Protein: 35g`,
      fr: `# Kebab\n**Pays**: Turquie • **Portions**: 2 • **Temps**: 30min • **Difficulté**: Moyen\n\n## Ingrédients\n- Agneau 300g\n- Oignon 1\n- Poivrons 2\n- Yaourt 100ml\n\n## Instructions\n1. Faites mariner la viande\n2. Enfilez sur des brochettes\n3. Faites griller\n\n## Nutrition (Approx)\n- Calories: 280 kcal\n- Protéines: 35g`,
    },
  };
  
  return examples[country]?.[locale] || examples[country].en;
}


