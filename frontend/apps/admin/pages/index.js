import Head from 'next/head'
import { WelcomeCard } from '../components/WelcomeCard'

export default function AdminHome() {
  return (
    <>
      <Head>
        <title>Biogrix Admin | Dashboard</title>
        <meta name="description" content="Admin dashboard for Biogrix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <WelcomeCard
          title="Biogrix Admin"
          subtitle="Admin Dashboard"
          description="Internal management portal"
        />
      </main>
    </>
  )
}
