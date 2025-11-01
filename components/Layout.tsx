import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import LanguageSelector from './LanguageSelector';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link 
              href={router.locale === 'ja' ? '/' : `/${router.locale || 'ja'}`}
              locale={router.locale || 'ja'}
              className="text-xl md:text-2xl font-bold text-primary-600"
            >
              🍽️ Food Trip
            </Link>
            
            <div className="hidden md:flex gap-4 lg:gap-6 items-center">
              <Link 
                href="/blog"
                locale={router.locale || 'ja'}
                className="hover:text-primary-600 transition-colors text-sm lg:text-base"
              >
                {t('nav.blog')}
              </Link>
              <Link 
                href="/ingredient-based"
                locale={router.locale || 'ja'}
                className="hover:text-primary-600 transition-colors text-sm lg:text-base"
              >
                {t('nav.ingredientBased')}
              </Link>
              <Link 
                href="/daily-recommendation"
                locale={router.locale || 'ja'}
                className="hover:text-primary-600 transition-colors text-sm lg:text-base"
              >
                {t('nav.dailyRecommendation')}
              </Link>
              <Link 
                href="/diet-plan"
                locale={router.locale || 'ja'}
                className="hover:text-primary-600 transition-colors text-sm lg:text-base"
              >
                {t('nav.dietPlan')}
              </Link>
              
              {/* Language Selector */}
              <LanguageSelector />
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white mt-8 md:mt-12 py-6 md:py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start">
              <Link 
                href="/terms"
                locale={router.locale || 'ja'}
                className="text-sm md:text-base text-gray-600 hover:text-primary-600 transition-colors"
              >
                {t('footer.terms')}
              </Link>
              <Link 
                href="/privacy"
                locale={router.locale || 'ja'}
                className="text-sm md:text-base text-gray-600 hover:text-primary-600 transition-colors"
              >
                {t('footer.privacy')}
              </Link>
              <Link 
                href="/contact"
                locale={router.locale || 'ja'}
                className="text-sm md:text-base text-gray-600 hover:text-primary-600 transition-colors"
              >
                {t('footer.contact')}
              </Link>
            </div>
            <p className="text-gray-600 text-xs md:text-sm text-center md:text-left">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;


