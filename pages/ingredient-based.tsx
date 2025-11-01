import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Layout from '@/components/Layout';
import RecipeResult from '@/components/RecipeResult';
import LoadingSpinner from '@/components/LoadingSpinner';
import CountrySelector from '@/components/CountrySelector';
import { Recipe, RecipeFilters } from '@/types/recipe';
import { Country } from '@/types/database';
import { SEO } from '@/lib/seo';

// 카테고리별 재료 매핑
const ingredientCategories = {
  meat: ['beef', 'pork', 'chicken', 'fish', 'shrimp', 'squid', 'tofu'],
  vegetables: ['onion', 'garlic', 'carrot', 'potato', 'tomato', 'cabbage', 'spinach', 'mushroom', 'bellPepper', 'zucchini', 'greenOnion', 'cucumber', 'lettuce'],
  fruits: ['apple', 'banana', 'lemon', 'orange'],
  sauces: ['soySauce', 'sesameOil', 'gochujang', 'doenjang', 'miso', 'oysterSauce', 'ketchup', 'mayonnaise'],
  seasonings: ['salt', 'pepper', 'sugar', 'ginger', 'chiliPepper', 'sesame'],
  grains: ['rice', 'noodles', 'ramen', 'udon', 'pasta', 'flour'],
  dairy: ['egg', 'milk', 'cheese', 'butter', 'yogurt'],
};

const categoryOrder: Array<keyof typeof ingredientCategories> = ['meat', 'vegetables', 'fruits', 'sauces', 'seasonings', 'grains', 'dairy'];

const IngredientBasedPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  
  const [filters, setFilters] = useState<RecipeFilters>({
    ingredients: [],
    servings: 2,
    maxTime: 60,
    difficulty: 'medium',
    allergies: [],
  });

  const [allergyInput, setAllergyInput] = useState('');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [previousRecipes, setPreviousRecipes] = useState<string[]>([]);

  // 국가 선택(0) + 카테고리들 + 설정 페이지
  const totalSteps = categoryOrder.length + 2;

  const toggleIngredient = (ingredientKey: string) => {
    const ingredientName = t(`ingredientBased.items.${ingredientKey}`);
    
    if (selectedIngredients.includes(ingredientName)) {
      setSelectedIngredients(selectedIngredients.filter(i => i !== ingredientName));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredientName]);
    }
  };

  const isIngredientSelected = (ingredientKey: string) => {
    const ingredientName = t(`ingredientBased.items.${ingredientKey}`);
    return selectedIngredients.includes(ingredientName);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addAllergy = () => {
    if (allergyInput.trim() && !filters.allergies?.includes(allergyInput.trim())) {
      setFilters({
        ...filters,
        allergies: [...(filters.allergies || []), allergyInput.trim()],
      });
      setAllergyInput('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setFilters({
      ...filters,
      allergies: filters.allergies?.filter(a => a !== allergy),
    });
  };

  const generateRecipe = async (isRegenerate: boolean = false) => {
    if (!selectedCountry) {
      alert(t('recipe.selectCountryFirst'));
      return;
    }
    
    setLoading(true);
    
    try {
      const requestBody = {
        type: 'ingredient',
        country: selectedCountry,
        filters: {
          ...filters,
          ingredients: selectedIngredients,
        },
        previousRecipes: isRegenerate ? previousRecipes : [],
        language: i18n.language,
      };

      const response = await fetch('/api/ai/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country: selectedCountry,
          ingredients: selectedIngredients,
          servings: filters.servings,
          time_limit: filters.maxTime,
          difficulty: filters.difficulty,
          allergies: filters.allergies || [],
          locale: i18n.language as 'ko' | 'ja' | 'en' | 'fr',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }

      const data = await response.json();
      // API 응답을 Recipe 형식으로 변환
      const newRecipe: Recipe = {
        title: '', // 마크다운에서 추출
        ingredients: [],
        instructions: [],
        cookingTime: data.metadata?.time_minutes || filters.maxTime || 30,
        servings: data.metadata?.servings || filters.servings,
        difficulty: data.metadata?.difficulty || filters.difficulty || 'medium',
        markdown: data.recipe_md,
        country: selectedCountry || undefined,
      };
      setRecipe(newRecipe);
      
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
          recipeType: 'ingredient-based',
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

  const categoryIcons = {
    meat: '🥩',
    vegetables: '🥬',
    fruits: '🍎',
    sauces: '🧂',
    seasonings: '🌶️',
    grains: '🍚',
    dairy: '🥛',
  };

  return (
    <Layout>
      <SEO title={t('ingredientBased.title')} description={t('ingredientBased.description')} path="/ingredient-based" />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🥘 {t('ingredientBased.title')}
        </h1>
        <p className="text-gray-600 mb-8">
          {t('ingredientBased.description')}
        </p>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600">
              {t('ingredientBased.step')} {currentStep + 1} {t('ingredientBased.of')} {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {selectedIngredients.length} {t('ingredientBased.ingredients')}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="card mb-8">
          {/* Step 0: Country Selection */}
          {currentStep === 0 && (
            <CountrySelector
              selectedCountry={selectedCountry}
              onSelect={setSelectedCountry}
            />
          )}

          {/* Category Selection Steps */}
          {currentStep > 0 && currentStep <= categoryOrder.length && (
            <>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{categoryIcons[categoryOrder[currentStep - 1]]}</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {t(`ingredientBased.categories.${categoryOrder[currentStep - 1]}`)}
                </h2>
                <p className="text-gray-600">
                  {t('ingredientBased.selectIngredients')}
                </p>
              </div>

              {/* Ingredient Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                {ingredientCategories[categoryOrder[currentStep - 1]].map((ingredientKey) => (
                  <button
                    key={ingredientKey}
                    onClick={() => toggleIngredient(ingredientKey)}
                    className={`p-4 rounded-lg border-2 transition-all font-medium ${
                      isIngredientSelected(ingredientKey)
                        ? 'border-primary-600 bg-primary-50 text-primary-800 scale-95'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:shadow-md'
                    }`}
                  >
                    {t(`ingredientBased.items.${ingredientKey}`)}
                  </button>
                ))}
              </div>

              {/* Selected Ingredients in Current Category */}
              {selectedIngredients.filter(ing => 
                ingredientCategories[categoryOrder[currentStep - 1]].some(key => 
                  t(`ingredientBased.items.${key}`) === ing
                )
              ).length > 0 && (
                <div className="bg-primary-50 rounded-lg p-4 mb-6">
                  <p className="text-sm font-semibold text-primary-800 mb-2">
                    ✅ {t('ingredientBased.ingredients')}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedIngredients
                      .filter(ing => 
                        ingredientCategories[categoryOrder[currentStep - 1]].some(key => 
                          t(`ingredientBased.items.${key}`) === ing
                        )
                      )
                      .map((ingredient) => (
                        <span
                          key={ingredient}
                          className="px-3 py-1 bg-white text-primary-800 rounded-full text-sm"
                        >
                          {ingredient}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Final Settings Step */}
          {currentStep === categoryOrder.length + 1 && (
            <>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⚙️</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {t('ingredientBased.title')}
                </h2>
                <p className="text-gray-600">
                  {t('ingredientBased.description')}
                </p>
              </div>

              {/* All Selected Ingredients */}
              {selectedIngredients.length > 0 && (
                <div className="mb-6 pb-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    ✅ {t('ingredientBased.ingredients')} ({selectedIngredients.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedIngredients.map((ingredient) => (
                      <span
                        key={ingredient}
                        className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm flex items-center gap-2"
                      >
                        {ingredient}
                        <button
                          onClick={() => {
                            setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
                          }}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Settings */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Servings */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('ingredientBased.servings')}
                  </label>
                  <input
                    type="number"
                    value={filters.servings}
                    onChange={(e) => setFilters({ ...filters, servings: parseInt(e.target.value) })}
                    min="1"
                    max="10"
                    className="input-field"
                  />
                </div>

                {/* Max Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('ingredientBased.maxTime')} ({filters.maxTime} {t('recipe.minutes')})
                  </label>
                  <input
                    type="range"
                    value={filters.maxTime}
                    onChange={(e) => setFilters({ ...filters, maxTime: parseInt(e.target.value) })}
                    min="15"
                    max="180"
                    step="15"
                    className="w-full"
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('ingredientBased.difficulty')}
                  </label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters({ ...filters, difficulty: e.target.value as any })}
                    className="input-field"
                  >
                    <option value="easy">{t('difficulty.easy')}</option>
                    <option value="medium">{t('difficulty.medium')}</option>
                    <option value="hard">{t('difficulty.hard')}</option>
                  </select>
                </div>

                {/* Allergies */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('ingredientBased.allergies')}
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={allergyInput}
                      onChange={(e) => setAllergyInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                      placeholder={t('ingredientBased.allergiesPlaceholder')}
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
                    {filters.allergies?.map((allergy) => (
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
              </div>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← {t('ingredientBased.previous')}
            </button>

            {currentStep === 0 ? (
              <button
                onClick={handleNext}
                disabled={!selectedCountry}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('ingredientBased.next')} →
              </button>
            ) : currentStep <= categoryOrder.length ? (
              <button
                onClick={handleNext}
                className="btn-primary"
              >
                {t('ingredientBased.next')} →
              </button>
            ) : (
              <button
                onClick={() => generateRecipe(false)}
                disabled={loading || selectedIngredients.length === 0 || !selectedCountry}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🎯 {t('ingredientBased.generate')}
              </button>
            )}
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

export default IngredientBasedPage;
