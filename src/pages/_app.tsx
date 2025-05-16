import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "../context/ThemeContext";
import { ParticlesProvider } from "../context/ParticlesContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ParticlesProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        </Head>
        <Component {...pageProps} />
      </ParticlesProvider>
    </ThemeProvider>
  );
}
