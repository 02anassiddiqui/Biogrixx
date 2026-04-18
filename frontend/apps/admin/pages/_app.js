// pages/_app.js
import '../styles/globals.css'
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      {/* 🚀 Professional Dark Toaster Configuration */}
    </>
  )
}