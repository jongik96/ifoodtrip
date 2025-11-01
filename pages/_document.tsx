import { Html, Head, Main, NextScript } from 'next/document';
import Document, { DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    const { locale } = this.props.__NEXT_DATA__;
    return (
      <Html lang={locale || 'ja'}>
        <Head>
          <meta charSet="utf-8" />
          <meta name="description" content="AI-powered recipe generator with personalized recommendations" />
          <link rel="icon" href="/favicon.ico" />
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





