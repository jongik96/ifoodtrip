import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';

const TermsPage: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const currentLocale = router.locale || 'ja';

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" locale={currentLocale} className="text-primary-600 hover:underline">
            ← {t('common.back')}
          </Link>
        </div>

        <div className="card">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t('terms.title')}
          </h1>
          <p className="text-gray-600 mb-8">{t('terms.lastUpdated')}</p>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {t('terms.section1Title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('terms.section1Content')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {t('terms.section2Title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('terms.section2Content')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {t('terms.section3Title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('terms.section3Content')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {t('terms.section4Title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('terms.section4Content')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {t('terms.section5Title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('terms.section5Content')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {t('terms.section6Title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('terms.section6Content')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {t('terms.section7Title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t('terms.section7Content')}
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

export default TermsPage;



