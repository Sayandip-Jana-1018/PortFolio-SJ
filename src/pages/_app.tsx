import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "../context/ThemeContext";
import { ParticlesProvider } from "../context/ParticlesContext";
import LoadingScreen from "../components/common/LoadingScreen";

// Self-hosted and preloaded by next/font, with a fallback sized to match. A CSS
// @import from Google blocked rendering, and the swap shifted every heading.
const outfit = Outfit({ subsets: ["latin"], display: "swap" });
const fontVariables = `:root{--font-title:${outfit.style.fontFamily},sans-serif;--font-body:${outfit.style.fontFamily},sans-serif}`;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ParticlesProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
          <meta name="theme-color" content="#0a0a0a" />
          <style dangerouslySetInnerHTML={{ __html: fontVariables }} />
        </Head>

        {/* Premium loading screen */}
        <LoadingScreen minDisplayTime={1800} />

        {/* Main content */}
        <Component {...pageProps} />
      </ParticlesProvider>
    </ThemeProvider>
  );
}

