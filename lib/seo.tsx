import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  path?: string;
  noindex?: boolean;
  enableAdSense?: boolean; // AdSense 자동 광고 활성화 여부
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = '/ifoodtrip-og.png',
  path = '',
  noindex = false,
  enableAdSense = false, // 기본값은 false (충분한 콘텐츠가 있을 때만 활성화)
}) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const currentLocale = router.locale || 'ja';
  const baseUrl = 'https://ifoodtrip.com';
  
  // Default values from translation
  const siteName = t('seo.siteName');
  const defaultDescription = t('seo.description');
  const defaultKeywords = t('seo.keywords');
  
  // Construct full URL
  const localePrefix = currentLocale === 'ja' ? '' : `/${currentLocale}`;
  const fullPath = path || router.asPath;
  const canonicalUrl = `${baseUrl}${localePrefix}${fullPath === '/' ? '' : fullPath}`;
  
  // Final values
  const pageTitle = title ? `${title} | ${siteName}` : siteName;
  const pageDescription = description || defaultDescription;
  const pageKeywords = keywords || defaultKeywords;
  const ogImage = image.startsWith('http') ? image : `${baseUrl}${image}`;
  
  // Language alternate URLs
  const alternateUrls = {
    ko: `${baseUrl}/ko${path}`,
    ja: `${baseUrl}/ja${path}`,
    en: `${baseUrl}/en${path}`,
    fr: `${baseUrl}/fr${path}`,
  };
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {pageKeywords && <meta name="keywords" content={pageKeywords} />}
      <link rel="canonical" href={canonicalUrl} />
      
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={currentLocale === 'ko' ? 'ko_KR' : currentLocale === 'ja' ? 'ja_JP' : currentLocale === 'en' ? 'en_US' : 'fr_FR'} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Language Alternate Links */}
      <link rel="alternate" hrefLang="ko" href={alternateUrls.ko} />
      <link rel="alternate" hrefLang="ja" href={alternateUrls.ja} />
      <link rel="alternate" hrefLang="en" href={alternateUrls.en} />
      <link rel="alternate" hrefLang="fr" href={alternateUrls.fr} />
      <link rel="alternate" hrefLang="x-default" href={baseUrl} />
      
      {/* Google AdSense - 충분한 콘텐츠가 있는 페이지에서만 활성화 */}
      {enableAdSense && (
        <>
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8843011911940029"
            crossOrigin="anonymous"
          />
        </>
      )}
    </Head>
  );
};

