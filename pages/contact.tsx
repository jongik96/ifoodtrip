import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';

const ContactPage: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const currentLocale = router.locale || 'ja';

  const handleContactClick = () => {
    const subject = encodeURIComponent(t('contact.emailSubject'));
    window.location.href = `mailto:pji3503@gmail.com?subject=${subject}`;
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/" locale={currentLocale} className="text-primary-600 hover:underline">
            ← {t('common.back')}
          </Link>
        </div>

        <div className="card text-center">
          <div className="mb-8">
            <div className="text-6xl mb-6">📧</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('contact.description')}
            </p>
          </div>

          <div className="bg-gradient-to-r from-primary-50 to-red-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {t('contact.subtitle')}
            </h2>
            <p className="text-gray-700 mb-6">
              {t('contact.message')}
            </p>
            
            <button
              onClick={handleContactClick}
              className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
            >
              <span>✉️</span>
              {t('contact.button')}
            </button>
          </div>

          <p className="text-sm text-gray-500">
            {t('contact.note')}
          </p>
        </div>

        {/* FAQ or Additional Info Section */}
        <div className="card mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            💡 {t('contact.quickTips')}
          </h2>
          <div className="space-y-4 text-left">
            <div className="border-l-4 border-primary-600 pl-4">
              <h3 className="font-semibold text-gray-800 mb-1">
                {t('contact.tip1Title')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('contact.tip1Desc')}
              </p>
            </div>
            <div className="border-l-4 border-red-600 pl-4">
              <h3 className="font-semibold text-gray-800 mb-1">
                {t('contact.tip2Title')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('contact.tip2Desc')}
              </p>
            </div>
            <div className="border-l-4 border-orange-600 pl-4">
              <h3 className="font-semibold text-gray-800 mb-1">
                {t('contact.tip3Title')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('contact.tip3Desc')}
              </p>
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

export default ContactPage;

