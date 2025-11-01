import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { SEO } from '@/lib/seo';

const PrivacyPage: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const currentLocale = router.locale || 'ja';

  return (
    <Layout>
      <SEO title={t('privacy.title')} description={t('privacy.lastUpdated')} path="/privacy" />
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" locale={currentLocale} className="text-primary-600 hover:underline">
            ← {t('common.back')}
          </Link>
        </div>

        <div className="card">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t('privacy.title')}
          </h1>
          <p className="text-gray-600 mb-8">{t('privacy.lastUpdated')}</p>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {t('privacy.section1Title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('privacy.section1Content')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {t('privacy.section2Title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('privacy.section2Content')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {t('privacy.section3Title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('privacy.section3Content')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {t('privacy.section4Title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('privacy.section4Content')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {t('privacy.section5Title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('privacy.section5Content')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {t('privacy.section6Title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('privacy.section6Content')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {t('privacy.section7Title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('privacy.section7Content')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {t('privacy.section8Title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('privacy.section8Content')}
              </p>
            </section>
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

export default PrivacyPage;



