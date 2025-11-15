import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { SEO } from '@/lib/seo';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const currentLocale = router.locale || 'ja';

  return (
    <Layout>
      <SEO 
        title={t('404.title')} 
        description={t('404.description')} 
        path="/404"
        enableAdSense={false} // 404 페이지에는 콘텐츠가 없으므로 AdSense 비활성화
        noindex={true}
      />
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t('404.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t('404.description')}
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/" locale={currentLocale}>
            <button className="btn-primary text-lg px-8 py-4">
              {t('404.backHome')}
            </button>
          </Link>
          
          <div className="mt-8">
            <p className="text-gray-600 mb-4">{t('404.suggestions')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/ingredient-based" locale={currentLocale} className="text-primary-600 hover:underline">
                {t('nav.ingredientBased')}
              </Link>
              <Link href="/daily-recommendation" locale={currentLocale} className="text-primary-600 hover:underline">
                {t('nav.dailyRecommendation')}
              </Link>
              <Link href="/diet-plan" locale={currentLocale} className="text-primary-600 hover:underline">
                {t('nav.dietPlan')}
              </Link>
            </div>
          </div>
        </div>
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

export default NotFoundPage;

