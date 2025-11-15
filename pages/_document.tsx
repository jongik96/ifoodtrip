import { Html, Head, Main, NextScript } from 'next/document';
import Document, { DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    const { locale } = this.props.__NEXT_DATA__;
    const currentLocale = locale || 'ja';
    const baseUrl = 'https://ifoodtrip.com';
    
    return (
      <Html lang={currentLocale}>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          
          {/* Favicon */}
          <link rel="icon" type="image/png" href="/ifoodtrip-favi.png" />
          <link rel="apple-touch-icon" href="/ifoodtrip-favi.png" />
          
          {/* Basic Meta Tags */}
          <meta name="robots" content="index, follow" />
          <meta name="theme-color" content="#f97316" />
          
          {/* Google Search Console Verification */}
          <meta name="google-site-verification" content="lNe09W1_Uu8MR7rQOAqDLtOhdsLTHMEOBeBAYD_dV_0" />
          
          {/* Google AdSense - 조건부 로드 (각 페이지에서 활성화) */}
          {/* 자동 광고는 충분한 콘텐츠가 있는 페이지에서만 활성화됩니다 */}
          
          {/* Language Alternate Links */}
          <link rel="alternate" hrefLang="ko" href={`${baseUrl}/ko`} />
          <link rel="alternate" hrefLang="ja" href={`${baseUrl}/ja`} />
          <link rel="alternate" hrefLang="en" href={`${baseUrl}/en`} />
          <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr`} />
          <link rel="alternate" hrefLang="x-default" href={baseUrl} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;





