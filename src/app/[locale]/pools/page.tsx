'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { type Locale, getTranslation } from '@/lib/i18n'
import Footer from '@/components/Footer'
import { Search, Plus, Clock, Users, ChevronRight, ArrowRight, TrendingDown, Loader2, Package } from 'lucide-react'

function formatCAD(n: number) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(n)
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
}

const CATEGORIES = [
  'Tires', 'Auto Parts', 'Shop Supplies', 'PPE', 'Lubricants',
  'Construction', 'Food Service', 'Cleaning', 'Other',
]

function AppNavbar({ locale, userName }: { locale: Locale; userName?: string }) {
  const t = getTranslation(locale)
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-lg leading-none">t</span>
            </div>
            <span className="text-xl font-black tracking-tight text-brand-800">taddam</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/dashboard`} className="text-sm text-slate-600 hover:text-slate-900 font-medium hidden sm:block">{t.nav.dashboard}</Link>
            <Link href={`/${locale}/pools/create`} className="btn-primary text-sm py-2 px-4">
              <Plus size={15} /> {t.pools.createPool}
            </Link>
            <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
              {userName?.slice(0, 2).toUpperCase() ?? 'U'}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function PoolCard({ pool, locale }: { pool: any; locale: Locale }) {
  const t = getTranslation(locale)
  const pct = Math.round((pool.committedQty / pool.targetQty) * 100)
  const timeLeft = new Date(pool.closesAt).getTime() - Date.now()
  const daysLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60 * 24)))
  const hoursLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
  const urgency = daysLeft < 2
  const progressColor = pct >= 80 ? 'pool-progress-high' : pct >= 50 ? 'pool-progress-mid' : 'pool-progress-low'
  const savingsPct = pool.sku?.soloPrice > 0
    ? Math.round(((pool.sku.soloPrice - pool.currentUnitPrice) / pool.sku.soloPrice) * 100)
    : 0

  return (
    <div className={`card p-6 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${urgency ? 'border-accent-200' : ''}`}>
      {urgency && (
        <div className="flex items-center gap-1.5 mb-3 text-accent-600">
          <Clock size={13} />
          <span className="text-xs font-semibold">{locale === 'fr' ? 'Fermeture imminente!' : 'Closing soon!'}</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Package size={22} className="text-slate-400" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 text-sm leading-tight">
              {locale === 'fr' ? pool.sku?.nameFr : pool.sku?.nameEn}
            </p>
            <p className="text-xs text-slate-500 mt-1">{pool.sku?.category} · {pool.region}</p>
          </div>
        </div>
      </div>

      {/* Price and savings */}
      <div className="flex items-end justify-between mb-4 pb-4 border-b border-slate-100">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">{t.pools.unitPrice}</p>
          <div className="text-2xl font-black text-slate-900">{formatCAD(pool.currentUnitPrice ?? 0)}</div>
          {savingsPct > 0 && (
            <div className="flex items-center gap-1.5 mt-1">
              <TrendingDown size={13} className="text-success-600" />
              <span className="text-xs font-semibold text-success-600">-{savingsPct}% {t.pools.savingsVsSolo}</span>
            </div>
          )}
        </div>
        <div className="text-right">
          {pool.sku?.soloPrice > 0 && (
            <>
              <p className="text-xs text-slate-500 mb-0.5">{locale === 'fr' ? 'Prix individuel' : 'Solo price'}</p>
              <p className="text-sm text-slate-400 line-through">{formatCAD(pool.sku.soloPrice)}</p>
            </>
          )}
          <span className="badge-blue text-xs mt-1">{pool.supplier?.companyName?.split(' ').slice(0, 2).join(' ')}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span className="font-medium">{pool.committedQty} {locale === 'fr' ? 'engagées' : 'committed'}</span>
          <span>{pct}% {locale === 'fr' ? 'de l\'objectif' : 'of target'}</span>
        </div>
        <div className="progress-bar h-3">
          <div className={`progress-fill ${progressColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-5">
        <span className="flex items-center gap-1"><Users size={12} /> {pool.participantCount} {t.pools.participants}</span>
        <span className="flex items-center gap-1">
          <Clock size={12} /> {t.pools.closingIn} {daysLeft}{t.pools.days} {hoursLeft}{t.pools.hours}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-auto flex gap-2">
        <Link href={`/${locale}/pools/${pool.id}`} className="btn-primary flex-1 text-sm py-2.5 text-center">
          {t.pools.joinPool}
        </Link>
        <Link href={`/${locale}/pools/${pool.id}`} className="btn-ghost border border-slate-200 text-sm py-2.5 px-3">
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  )
}

export default function PoolsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const t = getTranslation(locale)
  const { data: session } = useSession()
  const user = session?.user as any

  const [pools, setPools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState<'closing' | 'newest' | 'savings'>('closing')

  useEffect(() => {
    fetch('/api/pools?status=OPEN&limit=50')
      .then(r => r.json())
      .then(d => { setPools(d.pools ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const results = pools.filter((p) => {
      const nameEn = p.sku?.nameEn ?? ''
      const nameFr = p.sku?.nameFr ?? ''
      const cat = p.sku?.category ?? ''
      const matchSearch = !search ||
        nameEn.toLowerCase().includes(search.toLowerCase()) ||
        nameFr.toLowerCase().includes(search.toLowerCase()) ||
        cat.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'all' || cat === category
      return matchSearch && matchCat
    })
    return [...results].sort((a, b) => {
      if (sort === 'closing') return new Date(a.closesAt).getTime() - new Date(b.closesAt).getTime()
      if (sort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sort === 'savings') {
        const soloA = a.sku?.soloPrice ?? 0
        const soloB = b.sku?.soloPrice ?? 0
        const savA = soloA > 0 ? (soloA - (a.currentUnitPrice ?? soloA)) / soloA : 0
        const savB = soloB > 0 ? (soloB - (b.currentUnitPrice ?? soloB)) / soloB : 0
        return savB - savA
      }
      return 0
    })
  }, [pools, search, category, sort])

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNavbar locale={locale} userName={user?.name} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t.pools.title}</h1>
              <p className="text-slate-500 mt-1">{t.pools.sub}</p>
            </div>
            <Link href={`/${locale}/pools/create`} className="btn-accent text-sm self-start">
              <Plus size={16} /> {t.pools.createPool}
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-60">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                className="input pl-10 text-sm py-2.5"
                placeholder={t.pools.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category */}
            <select
              className="input text-sm py-2.5 w-auto min-w-36"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">{t.pools.filterCategory}: {t.pools.filterAll}</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              className="input text-sm py-2.5 w-auto min-w-40"
              value={sort}
              onChange={(e) => setSort(e.target.value as 'closing' | 'newest' | 'savings')}
            >
              <option value="closing">{t.pools.sortBy}: {t.pools.sortClosing}</option>
              <option value="newest">{t.pools.sortBy}: {t.pools.sortNewest}</option>
              <option value="savings">{t.pools.sortBy}: {t.pools.sortSavings}</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="card p-6">
                <Skeleton className="h-12 w-full mb-4" />
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-3 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <>
            <p className="text-sm text-slate-500 mb-4">{filtered.length} {locale === 'fr' ? 'groupes ouverts' : 'open pools'}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((pool) => (
                <PoolCard key={pool.id} pool={pool} locale={locale} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Package size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-semibold text-slate-700 mb-2">{t.pools.noResults}</p>
            <button
              onClick={() => { setSearch(''); setCategory('all') }}
              className="btn-ghost mt-2"
            >
              {t.pools.clearFilters}
            </button>
          </div>
        )}

        {/* CTA to create */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white text-center">
          <h3 className="text-xl font-bold mb-2">{locale === 'fr' ? 'Vous ne trouvez pas ce qu\'il vous faut?' : 'Don\'t see what you need?'}</h3>
          <p className="text-white/75 mb-6 text-sm">{locale === 'fr' ? 'Créez un nouveau groupe de demande et laissez d\'autres se joindre à votre achat.' : 'Create a new demand pool and let others join your purchase.'}</p>
          <Link href={`/${locale}/pools/create`} className="btn-accent">
            {locale === 'fr' ? 'Créer un groupe' : 'Create a pool'} <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <Footer locale={locale} />
    </div>
  )
}
