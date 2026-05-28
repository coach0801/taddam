'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { type Locale, getTranslation } from '@/lib/i18n'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Search, SlidersHorizontal, Plus, Clock, Users, ChevronRight, ArrowRight, TrendingDown } from 'lucide-react'
import { MOCK_POOLS, CATEGORIES, REGIONS, formatCAD, getCurrentTier, getSavingsPct, formatTimeLeft, getNextTier } from '@/lib/mock-data'

function AppNavbar({ locale }: { locale: Locale }) {
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
            <Link href={`/${locale}/dashboard`} className="text-sm text-slate-600 hover:text-slate-900 font-medium hidden sm:block">Dashboard</Link>
            <Link href={`/${locale}/pools/create`} className="btn-primary text-sm py-2 px-4">
              <Plus size={15} /> {t.pools.createPool}
            </Link>
            <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">MT</div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function PoolCard({ pool, locale }: { pool: typeof MOCK_POOLS[0], locale: Locale }) {
  const t = getTranslation(locale)
  const tier = getCurrentTier(pool.offer.tiers, pool.committedQty)
  const nextTier = getNextTier(pool.offer.tiers, pool.committedQty)
  const pct = Math.round((pool.committedQty / pool.targetQty) * 100)
  const time = formatTimeLeft(pool.closesAt)
  const savings = getSavingsPct(pool.soloPrice, tier.unitPrice)
  const urgency = time.days < 2

  const progressColor = pct >= 80 ? 'pool-progress-high' : pct >= 50 ? 'pool-progress-mid' : 'pool-progress-low'

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
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">
            {pool.imageEmoji}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 text-sm leading-tight">{pool.skuName}</p>
            <p className="text-xs text-slate-500 mt-1">{pool.skuCategory} · {pool.region}</p>
          </div>
        </div>
      </div>

      {/* Price and savings */}
      <div className="flex items-end justify-between mb-4 pb-4 border-b border-slate-100">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">{t.pools.unitPrice}</p>
          <div className="text-2xl font-black text-slate-900">{formatCAD(tier.unitPrice)}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <TrendingDown size={13} className="text-success-600" />
            <span className="text-xs font-semibold text-success-600">-{savings}% {t.pools.savingsVsSolo}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 mb-0.5">{locale === 'fr' ? 'Prix individuel' : 'Solo price'}</p>
          <p className="text-sm text-slate-400 line-through">{formatCAD(pool.soloPrice)}</p>
          <span className="badge-blue text-xs mt-1">{pool.offer.supplierName.split(' ').slice(0, 2).join(' ')}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span className="font-medium">{pool.committedQty} committed</span>
          <span>{pct}% of target</span>
        </div>
        <div className="progress-bar h-3">
          <div className={`progress-fill ${progressColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
        {nextTier && (
          <p className="text-xs text-brand-600 font-medium mt-1.5">
            🎯 {nextTier.minQty - pool.committedQty} more → {formatCAD(nextTier.unitPrice)}/unit
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-5">
        <span className="flex items-center gap-1"><Users size={12} /> {pool.participantCount} {t.pools.participants}</span>
        <span className="flex items-center gap-1">
          <Clock size={12} /> {t.pools.closingIn} {time.days}{t.pools.days} {time.hours}{t.pools.hours}
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
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [region, setRegion] = useState('all')
  const [sort, setSort] = useState<'closing' | 'newest' | 'savings'>('closing')

  const filtered = useMemo(() => {
    const results = MOCK_POOLS.filter((p) => {
      const matchSearch = !search || p.skuName.toLowerCase().includes(search.toLowerCase()) || p.skuCategory.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'all' || p.skuCategory.toLowerCase() === category
      const matchRegion = region === 'all' || p.region === region
      return matchSearch && matchCat && matchRegion
    })
    return [...results].sort((a, b) => {
      if (sort === 'closing') return new Date(a.closesAt).getTime() - new Date(b.closesAt).getTime()
      if (sort === 'newest') return new Date(b.closesAt).getTime() - new Date(a.closesAt).getTime()
      if (sort === 'savings') {
        const savA = getSavingsPct(a.soloPrice, getCurrentTier(a.offer.tiers, a.committedQty).unitPrice)
        const savB = getSavingsPct(b.soloPrice, getCurrentTier(b.offer.tiers, b.committedQty).unitPrice)
        return Number(savB) - Number(savA)
      }
      return 0
    })
  }, [search, category, region, sort])

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNavbar locale={locale} />

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
                <option key={c.id} value={c.nameEn.toLowerCase()}>{c.nameEn}</option>
              ))}
            </select>

            {/* Region */}
            <select
              className="input text-sm py-2.5 w-auto min-w-36"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="all">{t.pools.filterRegion}: {t.pools.filterAll}</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
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
        {filtered.length > 0 ? (
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
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg font-semibold text-slate-700 mb-2">{t.pools.noResults}</p>
            <button
              onClick={() => { setSearch(''); setCategory('all'); setRegion('all') }}
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
