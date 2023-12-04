import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Righteous&family=Work+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <meta
          name="theme-color"
          content="#E4F2FF"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#E4F2FF"
          media="(prefers-color-scheme: dark)"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
