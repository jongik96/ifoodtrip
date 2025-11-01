import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Layout from '@/components/Layout';
import RecipeResult from '@/components/RecipeResult';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Recipe, DietFilters } from '@/types/recipe';
import { SEO } from '@/lib/seo';

const DietPlanPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  
  const [dietFilters, setDietFilters] = useState<DietFilters>({
    goal: 'diet',
    targetCalories: 700,
    allergies: [],
  });

  const [allergyInput, setAllergyInput] = useState('');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [previousRecipes, setPreviousRecipes] = useState<string[]>([]);

  const addAllergy = () => {
    if (allergyInput.trim() && !dietFilters.allergies?.includes(allergyInput.trim())) {
      setDietFilters({
        ...dietFilters,
        allergies: [...(dietFilters.allergies || []), allergyInput.trim()],
      });
      setAllergyInput('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setDietFilters({
      ...dietFilters,
      allergies: dietFilters.allergies?.filter(a => a !== allergy),
    });
  };

  const generateRecipe = async (isRegenerate: boolean = false) => {
    setLoading(true);
    
    try {
      const requestBody = {
        type: 'diet',
        dietFilters,
        previousRecipes: isRegenerate ? previousRecipes : [],
        language: i18n.language,
      };

      const response = await fetch('/api/ai/diet-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          calories: dietFilters.targetCalories || 700,
          days: 1,
          allergies: dietFilters.allergies || [],
          locale: i18n.language as 'ko' | 'ja' | 'en' | 'fr',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate diet plan');
      }

      const data = await response.json();
      // 다이어트 플랜을 Recipe 형식으로 변환
      const newRecipe: Recipe = {
        title: t('dietPlan.title'),
        ingredients: [],
        instructions: [],
        cookingTime: 0,
        servings: 1,
        difficulty: 'medium',
        markdown: data.diet_plan_md,
      };
      setRecipe(newRecipe);
      
      // 이전 레시피 목록에 추가 (최대 5개)
      if (isRegenerate && newRecipe.title) {
        setPreviousRecipes(prev => {
          const updated = [...prev, newRecipe.title];
          return updated.slice(-5);
        });
      } else if (newRecipe.title) {
        setPreviousRecipes([newRecipe.title]);
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      alert(t('errors.generateFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    generateRecipe(true);
  };

  const handleSaveRecipe = async () => {
    if (!recipe) return;

    try {
      const response = await fetch('/api/save-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipe,
          recipeType: 'diet-plan',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save recipe');
      }

      alert(t('recipe.saved'));
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert(t('errors.saveFailed'));
    }
  };

  const caloriePresets = {
    diet: [300, 500, 700, 900, 1100, 1300, 1500],
    muscle: [300, 500, 700, 900, 1100, 1300, 1500],
  };

  return (
    <Layout>
      <SEO title={t('dietPlan.title')} description={t('dietPlan.description')} path="/diet-plan" />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          💪 {t('dietPlan.title')}
        </h1>
        <p className="text-gray-600 mb-8">
          {t('dietPlan.description')}
        </p>

        {/* Diet Filters Form */}
        <div className="card mb-8">
          {/* Goal Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {t('dietPlan.selectGoal')}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setDietFilters({ ...dietFilters, goal: 'diet', targetCalories: 700 })}
                className={`p-6 rounded-xl border-4 transition-all ${
                  dietFilters.goal === 'diet'
                    ? 'border-primary-600 bg-primary-50 shadow-lg'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="text-4xl mb-2">🥗</div>
                <h4 className="text-xl font-bold text-gray-800">
                  {t('dietPlan.weightLoss')}
                </h4>
                <p className="text-gray-600 text-sm mt-2">
                  {t('dietPlan.weightLossDesc')}
                </p>
              </button>

              <button
                onClick={() => setDietFilters({ ...dietFilters, goal: 'muscle', targetCalories: 1100 })}
                className={`p-6 rounded-xl border-4 transition-all ${
                  dietFilters.goal === 'muscle'
                    ? 'border-primary-600 bg-primary-50 shadow-lg'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="text-4xl mb-2">🏋️</div>
                <h4 className="text-xl font-bold text-gray-800">
                  {t('dietPlan.muscleGain')}
                </h4>
                <p className="text-gray-600 text-sm mt-2">
                  {t('dietPlan.muscleGainDesc')}
                </p>
              </button>
            </div>
          </div>

          {/* Calorie Target */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {t('dietPlan.targetCalories')}: {dietFilters.targetCalories} {t('nutrition.calories')}
            </label>
            
            {/* Preset Buttons */}
            <div className="flex gap-2 mb-3 flex-wrap">
              {caloriePresets[dietFilters.goal].map((calories) => (
                <button
                  key={calories}
                  onClick={() => setDietFilters({ ...dietFilters, targetCalories: calories })}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    dietFilters.targetCalories === calories
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {calories} {t('nutrition.calories')}
                </button>
              ))}
            </div>

            {/* Custom Calorie Slider */}
            <input
              type="range"
              value={dietFilters.targetCalories}
              onChange={(e) => setDietFilters({ ...dietFilters, targetCalories: parseInt(e.target.value) })}
              min="300"
              max="1500"
              step="200"
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>300 {t('nutrition.calories')}</span>
              <span>1500 {t('nutrition.calories')}</span>
            </div>
          </div>

          {/* Allergies */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('dietPlan.allergies')}
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                placeholder={t('dietPlan.allergiesPlaceholder')}
                className="input-field"
              />
              <button
                onClick={addAllergy}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                {t('common.add')}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {dietFilters.allergies?.map((allergy) => (
                <span
                  key={allergy}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center gap-2"
                >
                  {allergy}
                  <button
                    onClick={() => removeAllergy(allergy)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => generateRecipe(false)}
              disabled={loading}
              className="btn-primary text-lg"
            >
              🎯 {t('dietPlan.generate')}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Recipe Result */}
        {!loading && recipe && (
          <RecipeResult
            recipe={recipe}
            onRegenerate={handleRegenerate}
            onSave={handleSaveRecipe}
          />
        )}
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    return {
      props: {
        ...(await serverSideTranslations(locale || 'ja', ['common'])),
      },
    };
  } catch (error) {
    console.error('Translation loading error:', error);
    return {
      props: {
        ...(await serverSideTranslations('ja', ['common'])),
      },
    };
  }
};

export default DietPlanPage;


