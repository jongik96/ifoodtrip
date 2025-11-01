import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const LanguageSelector: React.FC = () => {
  const router = useRouter();
  const { i18n } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const currentLocale = router.locale || i18n.language || 'ja';
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const changeLanguage = async (locale: string) => {
    if (currentLocale === locale) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);

    try {
      const { pathname, query, asPath } = router;
      
      // Next.js router.push를 사용하여 언어 변경
      // locale prop을 사용하면 Next.js가 자동으로 올바른 경로로 이동
      await i18n.changeLanguage(locale);
      
      router.push(
        {
          pathname,
          query,
        },
        undefined,
        { locale }
      );
    } catch (error) {
      console.error('Language change error:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded text-sm bg-gray-200 hover:bg-gray-300 transition-colors"
      >
        <span>{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
        <span className="text-xs">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 ${
                  currentLocale === lang.code ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-700'
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.name}</span>
                {currentLocale === lang.code && <span className="ml-auto text-primary-600">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

