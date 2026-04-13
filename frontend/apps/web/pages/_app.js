import Head from "next/head";
import { Inter } from "next/font/google";
import MainLayout from "../layouts/MainLayout";
import { LanguageProvider } from "../context/LanguageContext"; // 🌍 Import context
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" />
        <title>Biogrix | Digital Biogas Infrastructure</title>
      </Head>

      {/* 🚀 LanguageProvider sabse upar taaki har page ko data mile */}
      <LanguageProvider>
        <div className={inter.className}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </div>
      </LanguageProvider>
    </>
  );
}
