import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";
import { ThemeProvider } from "../context/ThemeContext";
import { ParticlesProvider } from "../context/ParticlesContext";
import LoadingScreen from "../components/common/LoadingScreen";

export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ThemeProvider>
      <ParticlesProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
          <meta name="theme-color" content="#0a0a0a" />
        </Head>

        {/* Premium loading screen */}
        <LoadingScreen
          minDisplayTime={1800}
          onLoadingComplete={() => setIsLoading(false)}
        />

        {/* Main content */}
        <Component {...pageProps} />
      </ParticlesProvider>
    </ThemeProvider>
  );
}

