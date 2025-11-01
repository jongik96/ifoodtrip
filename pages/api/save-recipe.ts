import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { Recipe } from '@/types/recipe';

interface RequestBody {
  recipe: Recipe;
  recipeType: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { recipe, recipeType }: RequestBody = req.body;

    // 회원 기능 없이 레시피 저장 (user_id는 항상 null)
    const { data, error } = await supabase
      .from('recipes')
      .insert({
        user_id: null, // 회원 기능 없이 사용
        title: recipe.title,
        country: recipe.country || null,
        servings: recipe.servings,
        ingredients_json: recipe.ingredients,
        steps_md: recipe.markdown || (Array.isArray(recipe.instructions) ? recipe.instructions.join('\n') : ''),
        nutrition_json: recipe.nutritionInfo || null,
        time_minutes: recipe.cookingTime,
        difficulty: recipe.difficulty,
        public_bool: false,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error saving recipe:', error);
    return res.status(500).json({ error: 'Failed to save recipe' });
  }
}




