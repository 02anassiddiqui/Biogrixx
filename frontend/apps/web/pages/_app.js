import Head from 'next/head'
import { Inter } from 'next/font/google'
import MainLayout from '../layouts/MainLayout'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div className={inter.className}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </div>
    </>
  )
}
