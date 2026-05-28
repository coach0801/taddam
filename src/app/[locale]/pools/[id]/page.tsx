import { type Locale } from '@/lib/i18n'
import { MOCK_POOLS } from '@/lib/mock-data'
import PoolDetailContent from '@/components/PoolDetailContent'

export function generateStaticParams() {
  const locales: Locale[] = ['en', 'fr']
  const ids = MOCK_POOLS.map((p) => p.id)
  return locales.flatMap((locale) => ids.map((id) => ({ locale, id })))
}

export default function PoolDetailPage({ params }: { params: { locale: Locale; id: string } }) {
  const { locale, id } = params
  const pool = MOCK_POOLS.find((p) => p.id === id) ?? MOCK_POOLS[0]
  return <PoolDetailContent locale={locale} pool={pool} />
}
