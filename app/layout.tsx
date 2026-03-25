import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RTR FX - Institutional Forex Analysis',
  description: 'Institutional-grade supply & demand analysis. Real-time signals across Forex and major indices.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* TradingView chart library — required for live charts */}
        <script src="https://s3.tradingview.com/tv.js" async />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
