import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DialForge — Pay-Per-Call Analytics',
  description: 'Track your pay-per-call affiliate performance. Real-time P&L, campaign management, and goal tracking.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
