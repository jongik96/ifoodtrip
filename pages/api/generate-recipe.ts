import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { Recipe, RecipeFilters, DietFilters } from '@/types/recipe';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

interface RequestBody {
  type: 'ingredient' | 'daily' | 'diet';
  filters?: RecipeFilters;
  dietFilters?: DietFilters;
  dishName?: string;
  cuisineType?: string;
  previousRecipes?: string[];
  language?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Recipe | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      type,
      filters,
      dietFilters,
      dishName,
      cuisineType,
      previousRecipes = [],
      language = 'en',
    }: RequestBody = req.body;

    let prompt = '';

    // 언어 설정
    const isJapanese = language === 'ja';
    const langInstruction = isJapanese
      ? 'すべての内容を日本語で生成してください。'
      : 'Generate all content in English.';

    // 기능별 프롬프트 생성
    if (type === 'ingredient') {
      prompt = generateIngredientPrompt(filters!, previousRecipes, langInstruction);
    } else if (type === 'daily') {
      prompt = generateDailyPrompt(dishName!, cuisineType!, previousRecipes, langInstruction);
    } else if (type === 'diet') {
      prompt = generateDietPrompt(dietFilters!, previousRecipes, langInstruction);
    }

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: isJapanese
            ? 'あなたはプロの料理人であり、栄養士です。ユーザーの要求に基づいて詳細なレシピを生成してください。'
            : 'You are a professional chef and nutritionist. Generate detailed recipes based on user requirements.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const recipeData = JSON.parse(completion.choices[0].message.content || '{}');
    
    // 데이터 검증 및 변환
    const recipe: Recipe = {
      title: recipeData.title || 'Unknown Recipe',
      description: recipeData.description || '',
      ingredients: recipeData.ingredients || [],
      instructions: recipeData.instructions || [],
      cookingTime: recipeData.cookingTime || 30,
      servings: recipeData.servings || 2,
      difficulty: recipeData.difficulty || 'medium',
      calories: recipeData.calories,
      nutritionInfo: recipeData.nutritionInfo,
    };

    return res.status(200).json(recipe);
  } catch (error) {
    console.error('Error generating recipe:', error);
    return res.status(500).json({ error: 'Failed to generate recipe' });
  }
}

function generateIngredientPrompt(
  filters: RecipeFilters,
  previousRecipes: string[],
  langInstruction: string
): string {
  let prompt = `${langInstruction}\n\n`;
  prompt += `Create a recipe with the following requirements:\n`;

  if (filters.ingredients && filters.ingredients.length > 0) {
    prompt += `- Use these ingredients: ${filters.ingredients.join(', ')}\n`;
  }

  if (filters.servings) {
    prompt += `- Servings: ${filters.servings}\n`;
  }

  if (filters.maxTime) {
    prompt += `- Maximum cooking time: ${filters.maxTime} minutes\n`;
  }

  if (filters.difficulty) {
    prompt += `- Difficulty level: ${filters.difficulty}\n`;
  }

  if (filters.allergies && filters.allergies.length > 0) {
    prompt += `- Avoid these allergens: ${filters.allergies.join(', ')}\n`;
  }

  if (previousRecipes.length > 0) {
    prompt += `\n⚠️ IMPORTANT: DO NOT generate any of these recipes: ${previousRecipes.join(', ')}. You must create a completely different recipe.\n`;
  }

  prompt += `\nReturn the recipe in JSON format with the following structure:
{
  "title": "Recipe name",
  "description": "Brief description",
  "ingredients": [{"name": "ingredient", "amount": "quantity", "unit": "unit"}],
  "instructions": ["step 1", "step 2", ...],
  "cookingTime": number (in minutes),
  "servings": number,
  "difficulty": "easy|medium|hard",
  "calories": number (optional),
  "nutritionInfo": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number
  }
}`;

  return prompt;
}

function generateDailyPrompt(
  dishName: string,
  cuisineType: string,
  previousRecipes: string[],
  langInstruction: string
): string {
  let prompt = `${langInstruction}\n\n`;
  prompt += `Create a detailed recipe for "${dishName}" (${cuisineType} cuisine).\n`;

  if (previousRecipes.length > 0) {
    prompt += `\n⚠️ IMPORTANT: Previously recommended dishes: ${previousRecipes.join(', ')}. If the user requests another recipe, provide a different dish from the same cuisine type.\n`;
  }

  prompt += `\nReturn the recipe in JSON format with the following structure:
{
  "title": "Recipe name",
  "description": "Brief description of the dish and its cultural significance",
  "ingredients": [{"name": "ingredient", "amount": "quantity", "unit": "unit"}],
  "instructions": ["step 1", "step 2", ...],
  "cookingTime": number (in minutes),
  "servings": number,
  "difficulty": "easy|medium|hard",
  "calories": number (optional),
  "nutritionInfo": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number
  }
}`;

  return prompt;
}

function generateDietPrompt(
  dietFilters: DietFilters,
  previousRecipes: string[],
  langInstruction: string
): string {
  let prompt = `${langInstruction}\n\n`;

  if (dietFilters.goal === 'diet') {
    prompt += `Create a low-calorie, healthy recipe for weight loss.\n`;
  } else {
    prompt += `Create a high-protein recipe for muscle building.\n`;
  }

  if (dietFilters.targetCalories) {
    prompt += `- Target calories: approximately ${dietFilters.targetCalories} kcal\n`;
  }

  if (dietFilters.allergies && dietFilters.allergies.length > 0) {
    prompt += `- Avoid these allergens: ${dietFilters.allergies.join(', ')}\n`;
  }

  if (previousRecipes.length > 0) {
    prompt += `\n⚠️ IMPORTANT: DO NOT generate any of these recipes: ${previousRecipes.join(', ')}. You must create a completely different recipe.\n`;
  }

  prompt += `\nReturn the recipe in JSON format with detailed nutrition information:
{
  "title": "Recipe name",
  "description": "Brief description highlighting nutritional benefits",
  "ingredients": [{"name": "ingredient", "amount": "quantity", "unit": "unit"}],
  "instructions": ["step 1", "step 2", ...],
  "cookingTime": number (in minutes),
  "servings": number,
  "difficulty": "easy|medium|hard",
  "calories": number,
  "nutritionInfo": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number
  }
}`;

  return prompt;
}










