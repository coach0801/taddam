import { locales, type Locale } from '@/lib/i18n'
import type { Metadata } from 'next'
import { ToastProvider } from '@/components/Toast'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: 'taddam — Collective Procurement for Canadian SMEs',
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: Locale }
}) {
  return (
    <html lang={params.locale}>
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
