import type { Metadata, Viewport } from 'next'
import { Providers } from '@/components/Providers'
import { PWARegister } from '@/components/PWARegister'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  themeColor: '#FF007A',
}

export const metadata: Metadata = {
  title: 'VisaGPT - Smart Visa Assistant',
  description: 'AI-powered visa assistance. Check your visa chances, get document help, and apply smarter with 95% success rate.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'VisaGPT',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'VisaGPT',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/svg+xml" href="/icons/icon-512.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-512.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="VisaGPT" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#FF007A" />
      </head>
      <body className="font-cairo antialiased">
        <PWARegister />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
