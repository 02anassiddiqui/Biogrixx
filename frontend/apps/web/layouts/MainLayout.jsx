import { Navbar } from '../components/ui/Navbar'
import { Footer } from '../components/ui/Footer'

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
