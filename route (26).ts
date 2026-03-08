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

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://gozer.io'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'גוזר | המרכז הדיגיטלי לחייל המשוחרר',
    template: '%s | גוזר',
  },
  description: 'כל מה שחייל משוחרר צריך לדעת — זכויות ומענקים, צ\'קליסט שחרור, מתכנן טיול, והכוונה מקצועית לעתיד.',
  keywords: [
    'חייל משוחרר', 'זכויות חיילים', 'מענק שחרור', 'קרן השתלמות',
    'טיול אחרי צבא', 'הכוונה מקצועית', 'דמי אבטלה', 'ביטוח בריאות',
    'צ\'קליסט שחרור', 'gozer', 'גוזר',
  ],
  authors: [{ name: 'גוזר', url: APP_URL }],
  creator: 'גוזר',
  publisher: 'גוזר',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: APP_URL,
    siteName: 'גוזר',
    title: 'גוזר | המרכז הדיגיטלי לחייל המשוחרר',
    description: 'כל מה שחייל משוחרר צריך לדעת — זכויות, טיול, הכוונה מקצועית.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'גוזר — המרכז הדיגיטלי לחייל המשוחרר' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'גוזר | המרכז הדיגיטלי לחייל המשוחרר',
    description: 'כל מה שחייל משוחרר צריך לדעת.',
    images: ['/og-image.png'],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
  },
  alternates: {
    canonical: APP_URL,
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
