import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="stylesheet" href="/glassmorphism.css" />
        <link rel="stylesheet" href="/responsive.css" />
        {/* Viewport meta tag moved to _app.tsx as per Next.js recommendation */}
        <script src="/register-sw.js" defer></script>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
