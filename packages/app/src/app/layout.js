'use client';

import { Provider } from 'react-redux';
import { store } from './store.js';
import { ServiceAPIProvider } from './ReactContext.js';
import '../index.css';
import '../App.css';
import '../i18n'; // Initialize i18n
import Script from 'next/script';

export default function RootLayout({ children }) {
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

  return (
    <html lang="en">
      <head>
        <title>VizSurvey</title>
        <meta name="description" content="Visualization Survey Application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
          integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}');
          `}
        </Script>
        <Provider store={store}>
          <ServiceAPIProvider>
            {children}
          </ServiceAPIProvider>
        </Provider>
      </body>
    </html>
  );
}
