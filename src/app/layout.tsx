import type { Metadata } from 'next'
import { Assistant, Secular_One } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/layout/Providers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const assistant = Assistant({
  subsets: ['hebrew', 'latin'],
  variable: '--font-assistant',
  display: 'swap',
})

const secularOne = Secular_One({
  subsets: ['hebrew', 'latin'],
  weight: '400',
  variable: '--font-secular',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'גוזר | gozer.io', template: '%s | גוזר' },
  description: 'המרכז הדיגיטלי לחייל המשוחרר — זכויות, תכנון טיול, הכוונה מקצועית',
  keywords: ['חייל משוחרר', 'זכויות חיילים', 'מענק שחרור', 'טיול אחרי צבא'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    siteName: 'גוזר',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${assistant.variable} ${secularOne.variable}`}>
      <body className="min-h-screen bg-[#F8F9FA] font-sans text-[#1F2937] antialiased">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main id="main-content" className="flex-1" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
