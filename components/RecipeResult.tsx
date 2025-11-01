import React from 'react';
import { useTranslation } from 'next-i18next';
import { Recipe } from '@/types/recipe';
import MarkdownRecipe from './MarkdownRecipe';

interface RecipeResultProps {
  recipe: Recipe;
  onRegenerate: () => void;
  onSave: () => void;
}

const RecipeResult: React.FC<RecipeResultProps> = ({ recipe, onRegenerate, onSave }) => {
  const { t } = useTranslation('common');

  // 마크다운이 있으면 마크다운 렌더링, 없으면 기존 방식
  if (recipe.markdown) {
    return (
      <div className="card">
        <MarkdownRecipe markdown={recipe.markdown} />
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
          <button
            onClick={onRegenerate}
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            <span>🔄</span>
            {t('recipe.regenerate')}
          </button>
          <button
            onClick={onSave}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <span>💾</span>
            {t('recipe.save')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="border-b pb-6 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">{recipe.title}</h2>
        <p className="text-gray-600 mb-4">{recipe.description}</p>
        
        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⏱️</span>
            <span className="font-semibold">{recipe.cookingTime} {t('recipe.minutes')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">👥</span>
            <span className="font-semibold">{recipe.servings} {t('recipe.servings')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <span className="font-semibold">
              {t(`difficulty.${recipe.difficulty}`)}
            </span>
          </div>
        </div>
      </div>

      {/* Nutrition Info */}
      {recipe.nutritionInfo && (
        <div className="bg-gradient-to-r from-primary-50 to-red-50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            📊 {t('recipe.nutritionInfo')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {recipe.nutritionInfo.calories}
              </div>
              <div className="text-sm text-gray-600">{t('nutrition.calories')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {recipe.nutritionInfo.protein}g
              </div>
              <div className="text-sm text-gray-600">{t('nutrition.protein')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {recipe.nutritionInfo.carbs}g
              </div>
              <div className="text-sm text-gray-600">{t('nutrition.carbs')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {recipe.nutritionInfo.fat}g
              </div>
              <div className="text-sm text-gray-600">{t('nutrition.fat')}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Ingredients */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🥗 {t('recipe.ingredients')}
          </h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-gray-700 bg-gray-50 p-3 rounded-lg"
              >
                <span className="text-primary-600 font-semibold">•</span>
                <span>
                  <span className="font-semibold">{ingredient.name}</span>
                  {ingredient.amount && (
                    <span className="text-gray-600">
                      {' '}- {ingredient.amount}
                      {ingredient.unit && ` ${ingredient.unit}`}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            👨‍🍳 {t('recipe.instructions')}
          </h3>
          <ol className="space-y-3">
            {recipe.instructions.map((instruction, index) => (
              <li
                key={index}
                className="flex gap-3 text-gray-700"
              >
                <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </span>
                <span className="pt-1">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
        <button
          onClick={onRegenerate}
          className="btn-secondary flex-1 flex items-center justify-center gap-2"
        >
          <span>🔄</span>
          {t('recipe.regenerate')}
        </button>
        <button
          onClick={onSave}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          <span>💾</span>
          {t('recipe.save')}
        </button>
      </div>
    </div>
  );
};

export default RecipeResult;



