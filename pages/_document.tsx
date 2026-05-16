import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.svg" />
          <meta
            name="description"
            content="Terry Wildlife Photography - Capturing the raw beauty and truth of the wild of Botswana"
          />
          <meta property="og:site_name" content="Terry Wildlife Photography" />
          <meta
            property="og:description"
            content="Young wildlife photographer capturing the raw beauty and truth of the wild of Botswana"
          />
          <meta property="og:title" content="Terry Wildlife Photography" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Terry Wildlife Photography" />
          <meta
            name="twitter:description"
            content="Young wildlife photographer capturing the raw beauty and truth of the wild of Botswana"
          />
        </Head>
        <body className="bg-stone-100 antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
