export interface Recipe {
  title: string;
  description?: string;
  ingredients: Ingredient[];
  instructions: string[];
  cookingTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  calories?: number;
  nutritionInfo?: NutritionInfo;
  // 마크다운 형식 레시피 지원
  markdown?: string;
  country?: 'korea' | 'japan' | 'spain' | 'italy' | 'india' | 'turkey';
}

export interface Ingredient {
  name: string;
  amount: string;
  unit?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface RecipeFilters {
  ingredients?: string[];
  servings?: number;
  maxTime?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  allergies?: string[];
  previousRecipes?: string[];
}

export interface DietFilters {
  goal: 'diet' | 'muscle';
  targetCalories?: number;
  allergies?: string[];
  previousRecipes?: string[];
}


