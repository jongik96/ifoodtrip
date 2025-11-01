import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Layout from '@/components/Layout';
import RecipeResult from '@/components/RecipeResult';
import LoadingSpinner from '@/components/LoadingSpinner';
import CountrySelector from '@/components/CountrySelector';
import { Recipe } from '@/types/recipe';
import { Country } from '@/types/database';

const DailyRecommendationPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [servings, setServings] = useState(2);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);

  const generateRecipe = async (isRegenerate: boolean = false) => {
    if (!selectedCountry) {
      alert(t('recipe.selectCountryFirst'));
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/ai/today', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country: selectedCountry,
          servings,
          locale: i18n.language as 'ko' | 'ja' | 'en' | 'fr',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }

      const data = await response.json();
      // API 응답을 Recipe 형식으로 변환
      const newRecipe: Recipe = {
        title: '',
        ingredients: [],
        instructions: [],
        cookingTime: data.metadata?.time_minutes || 30,
        servings: data.metadata?.servings || servings,
        difficulty: data.metadata?.difficulty || 'medium',
        markdown: data.recipe_md,
        country: selectedCountry,
      };
      setRecipe(newRecipe);
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
          recipeType: 'daily-recommendation',
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

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🌟 {t('dailyRecommendation.title')}
        </h1>
        <p className="text-gray-600 mb-8">
          {t('dailyRecommendation.description')}
        </p>

        {/* Country Selection */}
        {!recipe && (
          <div className="card mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              {t('dailyRecommendation.selectCuisineType')}
            </h2>
            
            <CountrySelector
              selectedCountry={selectedCountry}
              onSelect={setSelectedCountry}
            />

            {/* Servings Selection */}
            <div className="mt-6 mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                {t('ingredientBased.servings')}: {servings}
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 4, 6, 8].map((num) => (
                  <button
                    key={num}
                    onClick={() => setServings(num)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      servings === num
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => generateRecipe(false)}
                disabled={loading || !selectedCountry}
                className="btn-primary text-lg"
              >
                ✨ {t('dailyRecommendation.generate')}
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Recipe Result */}
        {!loading && recipe && (
          <div>
            <div className="mb-4 text-center">
              <button
                onClick={() => {
                  setRecipe(null);
                  setSelectedCountry(null);
                }}
                className="text-primary-600 hover:text-primary-800 underline"
              >
                ← {t('common.back')}
              </button>
            </div>
            
            <RecipeResult
              recipe={recipe}
              onRegenerate={handleRegenerate}
              onSave={handleSaveRecipe}
            />
          </div>
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

export default DailyRecommendationPage;




