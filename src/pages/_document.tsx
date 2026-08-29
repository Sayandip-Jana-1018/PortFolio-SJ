import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="stylesheet" href="/styles/glassmorphism.css" />
        <link rel="stylesheet" href="/styles/responsive.css" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />

        {/* Unregister any previously installed service workers and clear caches */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  registrations.forEach(function(r) { r.unregister(); });
                });
                if (typeof caches !== 'undefined') {
                  caches.keys().then(function(names) {
                    names.forEach(function(n) { caches.delete(n); });
                  });
                }
              }
            `,
          }}
        />
      </body>
    </Html>
  );
}
