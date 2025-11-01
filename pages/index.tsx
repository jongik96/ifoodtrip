import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { SEO } from '@/lib/seo';

const HomePage: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const currentLocale = router.locale || 'ja';

  return (
    <Layout>
      <SEO title={t('home.title')} description={t('home.subtitle')} path="/" />
      {/* Modern Hero Section with Gradient */}
      <div className="relative text-center mb-12 md:mb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 opacity-10 blur-3xl"></div>
        <div className="relative z-10">
          <div className="inline-block mb-4 md:mb-6 px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full border border-orange-300">
            <span className="text-xs md:text-sm font-semibold text-orange-700">✨ AI-Powered Recipe Generator</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-4 md:mb-6 leading-tight px-4">
            {t('home.title')}
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 mb-6 md:mb-8 font-light px-4">
            {t('home.subtitle')}
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center mb-8 md:mb-12 px-4">
            <Link href="/ingredient-based" locale={currentLocale}>
              <button className="btn-primary text-base md:text-lg px-6 py-3 md:px-8 md:py-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                🚀 {t('home.ctaButton')}
              </button>
            </Link>
            <Link href="/about" locale={currentLocale}>
              <button className="px-6 py-3 md:px-8 md:py-4 rounded-full border-2 border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 transition-all duration-300 text-base md:text-lg">
                ℹ️ {t('about.title')}
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Modern Features Grid with Gradient Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {/* Feature 1: Ingredient-Based */}
        <Link href="/ingredient-based" locale={currentLocale}>
          <div className="group relative card cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-5xl md:text-7xl mb-4 md:mb-6 text-center transform group-hover:scale-110 transition-transform duration-300">🥘</div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4 text-center group-hover:text-primary-600 transition-colors">
                {t('home.feature1Title')}
              </h2>
              <p className="text-sm md:text-base text-gray-600 text-center mb-4 md:mb-6 leading-relaxed">
                {t('home.feature1Desc')}
              </p>
              <div className="text-center">
                <span className="inline-flex items-center text-primary-600 font-semibold group-hover:text-primary-700 transition-colors">
                  {t('home.getStarted')}
                  <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Feature 2: Daily Recommendation */}
        <Link href="/daily-recommendation" locale={currentLocale}>
          <div className="group relative card cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-5xl md:text-7xl mb-4 md:mb-6 text-center transform group-hover:scale-110 transition-transform duration-300">🌟</div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4 text-center group-hover:text-primary-600 transition-colors">
                {t('home.feature2Title')}
              </h2>
              <p className="text-sm md:text-base text-gray-600 text-center mb-4 md:mb-6 leading-relaxed">
                {t('home.feature2Desc')}
              </p>
              <div className="text-center">
                <span className="inline-flex items-center text-primary-600 font-semibold group-hover:text-primary-700 transition-colors">
                  {t('home.getStarted')}
                  <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Feature 3: Diet Plan */}
        <Link href="/diet-plan" locale={currentLocale}>
          <div className="group relative card cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-5xl md:text-7xl mb-4 md:mb-6 text-center transform group-hover:scale-110 transition-transform duration-300">💪</div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4 text-center group-hover:text-primary-600 transition-colors">
                {t('home.feature3Title')}
              </h2>
              <p className="text-sm md:text-base text-gray-600 text-center mb-4 md:mb-6 leading-relaxed">
                {t('home.feature3Desc')}
              </p>
              <div className="text-center">
                <span className="inline-flex items-center text-primary-600 font-semibold group-hover:text-primary-700 transition-colors">
                  {t('home.getStarted')}
                  <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* How It Works Section */}
      <div className="card bg-gradient-to-r from-primary-50 to-red-50 mt-8 md:mt-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 text-center">
          🤖 {t('home.howItWorks')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl md:text-2xl font-bold mx-auto mb-3 md:mb-4">
              1
            </div>
            <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-1 md:mb-2">{t('home.step1Title')}</h3>
            <p className="text-xs md:text-sm text-gray-600">{t('home.step1Desc')}</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl md:text-2xl font-bold mx-auto mb-3 md:mb-4">
              2
            </div>
            <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-1 md:mb-2">{t('home.step2Title')}</h3>
            <p className="text-xs md:text-sm text-gray-600">{t('home.step2Desc')}</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl md:text-2xl font-bold mx-auto mb-3 md:mb-4">
              3
            </div>
            <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-1 md:mb-2">{t('home.step3Title')}</h3>
            <p className="text-xs md:text-sm text-gray-600">{t('home.step3Desc')}</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl md:text-2xl font-bold mx-auto mb-3 md:mb-4">
              4
            </div>
            <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-1 md:mb-2">{t('home.step4Title')}</h3>
            <p className="text-xs md:text-sm text-gray-600">{t('home.step4Desc')}</p>
          </div>
        </div>
      </div>

      {/* Modern CTA Section */}
      <div className="text-center mt-12 md:mt-16 mb-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 mb-4 md:mb-6 px-4">
          {t('home.ctaTitle')}
        </h2>
        <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
          {t('home.ctaDescription')}
        </p>
        <Link href="/ingredient-based" locale={currentLocale}>
          <button className="btn-primary text-lg md:text-xl px-8 py-4 md:px-12 md:py-5 rounded-full shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 mb-6">
            🚀 {t('home.ctaButton')}
          </button>
        </Link>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const translations = await serverSideTranslations(locale || 'ja', ['common']);
    return {
      props: {
        ...translations,
      },
    };
  } catch (error) {
    console.error('Translation loading error:', error);
    // 에러 발생 시 기본 locale로 fallback
    return {
      props: {
        ...(await serverSideTranslations('ja', ['common'])),
      },
    };
  }
};

export default HomePage;


