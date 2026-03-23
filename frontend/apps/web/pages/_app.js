import Head from 'next/head'
import { Inter } from 'next/font/google'
import MainLayout from '../layouts/MainLayout'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }) {
  return (
    <div className={inter.className}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </div>
  )
}
