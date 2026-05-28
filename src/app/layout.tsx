import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'taddam — Collective Procurement for Canadian SMEs',
  description: 'Join demand pools with other Canadian small businesses to unlock volume pricing and save 20–35% on products your business buys regularly.',
  keywords: 'collective procurement, group buying, SME, Canadian business, volume pricing, B2B marketplace',
  openGraph: {
    title: 'taddam — Buy together. Save more.',
    description: 'Pool your demand with other Canadian SMEs and unlock the pricing reserved for large buyers.',
    type: 'website',
    locale: 'en_CA',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
