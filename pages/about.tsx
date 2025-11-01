import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { SEO } from '@/lib/seo';

const AboutPage: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const currentLocale = router.locale || 'ja';

  return (
    <Layout>
      <SEO title={t('about.title')} description={t('about.subtitle')} path="/about" />
      {/* Hero Section */}
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
          {t('about.title')}
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          {t('about.subtitle')}
        </p>
      </div>

      {/* How It Works Section */}
      <div className="card bg-gradient-to-r from-primary-50 to-red-50 mb-8 md:mb-12">
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

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
        <div className="card">
          <div className="text-4xl md:text-5xl mb-3 md:mb-4 text-center">🥘</div>
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3 text-center">
            {t('about.feature1Title')}
          </h3>
          <p className="text-sm md:text-base text-gray-600 text-center">
            {t('about.feature1Desc')}
          </p>
        </div>
        <div className="card">
          <div className="text-4xl md:text-5xl mb-3 md:mb-4 text-center">🌍</div>
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3 text-center">
            {t('about.feature2Title')}
          </h3>
          <p className="text-sm md:text-base text-gray-600 text-center">
            {t('about.feature2Desc')}
          </p>
        </div>
        <div className="card">
          <div className="text-4xl md:text-5xl mb-3 md:mb-4 text-center">💡</div>
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3 text-center">
            {t('about.feature3Title')}
          </h3>
          <p className="text-sm md:text-base text-gray-600 text-center">
            {t('about.feature3Desc')}
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          {t('home.ctaTitle')}
        </h2>
        <p className="text-base md:text-lg text-gray-600 mb-6">
          {t('home.ctaDescription')}
        </p>
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center px-4">
          <Link href="/ingredient-based" locale={currentLocale}>
            <button className="btn-primary text-base md:text-lg px-6 py-3 w-full md:w-auto">
              🥘 {t('nav.ingredientBased')}
            </button>
          </Link>
          <Link href="/daily-recommendation" locale={currentLocale}>
            <button className="btn-primary text-base md:text-lg px-6 py-3 w-full md:w-auto">
              🌟 {t('nav.dailyRecommendation')}
            </button>
          </Link>
          <Link href="/diet-plan" locale={currentLocale}>
            <button className="btn-primary text-base md:text-lg px-6 py-3 w-full md:w-auto">
              💪 {t('nav.dietPlan')}
            </button>
          </Link>
        </div>
        <div className="mt-8">
          <Link href="/" locale={currentLocale}>
            <button className="text-primary-600 hover:text-primary-700 font-semibold hover:underline">
              ← {t('common.backToHome')}
            </button>
          </Link>
        </div>
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
    return {
      props: {
        ...(await serverSideTranslations('ja', ['common'])),
      },
    };
  }
};

export default AboutPage;

