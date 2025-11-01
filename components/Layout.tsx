import React, { ReactNode, useState } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex flex-col">
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
            
            {/* Desktop Menu */}
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col gap-3">
                <Link 
                  href="/blog"
                  locale={router.locale || 'ja'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  {t('nav.blog')}
                </Link>
                <Link 
                  href="/ingredient-based"
                  locale={router.locale || 'ja'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  {t('nav.ingredientBased')}
                </Link>
                <Link 
                  href="/daily-recommendation"
                  locale={router.locale || 'ja'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  {t('nav.dailyRecommendation')}
                </Link>
                <Link 
                  href="/diet-plan"
                  locale={router.locale || 'ja'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  {t('nav.dietPlan')}
                </Link>
                <div className="px-3 py-2">
                  <LanguageSelector />
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white mt-auto py-6 md:py-8 border-t">
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


