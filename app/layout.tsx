import type { Metadata, Viewport } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Header } from '@/components/header'
import './globals.css'
import { AuthProvider } from "@/lib/AuthContext"

const notoSansJP = Noto_Sans_JP({ 
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: '登山診断アプリ - あなたにぴったりの山を見つけよう',
  description: '質問に答えるだけで、今のあなたにぴったりの登山先をおすすめします。体力や目的、気分に合わせた山選びをサポート。',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#4a7c59',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className="bg-background">
      <body className={`${notoSansJP.variable} font-sans antialiased min-h-screen`}>
  <AuthProvider>
    <Header />
    <main className="flex-1">
      {children}
    </main>
  </AuthProvider>
  {process.env.NODE_ENV === 'production' && <Analytics />}
</body>
    </html>
  )
}
