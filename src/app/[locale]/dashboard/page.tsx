'use client'
import Link from 'next/link'
import { type Locale, getTranslation } from '@/lib/i18n'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  TrendingDown, Package, Truck, BarChart3, Plus, ArrowRight,
  Clock, Users, ChevronRight, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react'
import { MOCK_POOLS, MOCK_ORDERS, formatCAD, getCurrentTier, getSavingsPct, formatTimeLeft } from '@/lib/mock-data'

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
            <Link href={`/${locale}/pools`} className="text-sm text-slate-600 hover:text-slate-900 font-medium">{t.nav.pools}</Link>
            <Link href={`/${locale}/pools/create`} className="btn-primary text-sm py-2 px-4">
              <Plus size={15} /> {t.nav.createPool}
            </Link>
            <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">MT</div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function StatusBadge({ status, locale }: { status: string; locale: Locale }) {
  const t = getTranslation(locale)
  const colors: Record<string, string> = {
    OPEN: 'badge-blue',
    FULFILLING: 'badge-orange',
    COMPLETED: 'badge-green',
    FAILED: 'badge-red',
    in_transit: 'badge-orange',
    delivered: 'badge-green',
    pending: 'badge-gray',
  }
  const labels: Record<string, string> = {
    OPEN: t.dashboard.status.open,
    FULFILLING: t.dashboard.status.fulfilling,
    COMPLETED: t.dashboard.status.completed,
    FAILED: t.dashboard.status.failed,
    in_transit: t.dashboard.status.in_transit,
    delivered: t.dashboard.status.delivered,
    pending: t.dashboard.status.pending,
  }
  return <span className={colors[status] || 'badge-gray'}>{labels[status] || status}</span>
}

export default function DashboardPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const t = getTranslation(locale)
  const myPools = MOCK_POOLS.slice(0, 3)
  const recommendedPools = MOCK_POOLS.slice(1, 4)

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNavbar locale={locale} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {t.dashboard.greeting}, Michel 👋
          </h1>
          <p className="text-slate-500 mt-1">Atelier Tremblay Auto · Montréal, QC · {t.dashboard.verifiedBuyer}</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            {
              icon: TrendingDown,
              value: '$4,280',
              label: t.dashboard.savingsTitle,
              sub: t.dashboard.savingsSub,
              color: 'text-success-600',
              bg: 'bg-success-50',
              change: t.dashboard.savingsChange,
              changeColor: 'text-success-600',
            },
            {
              icon: Package,
              value: '3',
              label: t.dashboard.activePoolsTitle,
              sub: t.dashboard.activePoolsSub,
              color: 'text-brand-600',
              bg: 'bg-brand-50',
              change: t.dashboard.activePoolsChange,
              changeColor: 'text-brand-600',
            },
            {
              icon: BarChart3,
              value: '7',
              label: t.dashboard.ordersTitle,
              sub: t.dashboard.ordersSub,
              color: 'text-accent-600',
              bg: 'bg-accent-50',
              change: t.dashboard.ordersChange,
              changeColor: 'text-accent-600',
            },
            {
              icon: Truck,
              value: '2',
              label: t.dashboard.pendingTitle,
              sub: t.dashboard.pendingSub,
              color: 'text-violet-600',
              bg: 'bg-violet-50',
              change: t.dashboard.pendingChange,
              changeColor: 'text-violet-600',
            },
          ].map((stat) => (
            <div key={stat.label} className="card p-5">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={stat.color} size={20} />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mb-0.5">{stat.value}</div>
              <div className="text-xs font-semibold text-slate-700 mb-1">{stat.label}</div>
              <div className="text-xs text-slate-400">{stat.sub}</div>
              <div className={`text-xs font-medium mt-2 ${stat.changeColor}`}>{stat.change}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-8">
            {/* My active pools */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">{t.dashboard.myPools}</h2>
                <Link href={`/${locale}/pools`} className="text-sm text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1">
                  {t.dashboard.viewAll} <ChevronRight size={14} />
                </Link>
              </div>
              <div className="space-y-4">
                {myPools.map((pool) => {
                  const tier = getCurrentTier(pool.offer.tiers, pool.committedQty)
                  const pct = Math.round((pool.committedQty / pool.targetQty) * 100)
                  const time = formatTimeLeft(pool.closesAt)
                  const savings = getSavingsPct(pool.soloPrice, tier.unitPrice)

                  return (
                    <Link key={pool.id} href={`/${locale}/pools/${pool.id}`} className="card p-5 block hover:border-brand-200 transition-colors">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                            {pool.imageEmoji}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm leading-tight">{pool.skuName}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{pool.skuCategory} · {pool.region}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-black text-slate-900">{formatCAD(tier.unitPrice)}</div>
                          <span className="badge-green text-xs">↓ {savings}%</span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                          <span>{pool.committedQty} / {pool.targetQty} units</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="progress-bar h-2">
                          <div
                            className={`progress-fill ${pct >= 80 ? 'pool-progress-high' : pct >= 50 ? 'pool-progress-mid' : 'pool-progress-low'}`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {pool.participantCount} participants
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {time.days}d {time.hours}h {t.dashboard.remaining}
                        </span>
                        <span className="text-brand-600 font-medium">{t.dashboard.viewPool}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Recent orders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">{t.dashboard.recentOrders}</h2>
                <Link href={`/${locale}/orders`} className="text-sm text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1">
                  {t.dashboard.viewAll} <ChevronRight size={14} />
                </Link>
              </div>
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.dashboard.colOrder}</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">{t.dashboard.colProduct}</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.dashboard.colTotal}</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.dashboard.colStatus}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MOCK_ORDERS.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="text-xs font-mono font-semibold text-slate-900">{order.id}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA')}</p>
                        </td>
                        <td className="px-5 py-3.5 hidden sm:table-cell">
                          <p className="text-xs text-slate-700 font-medium line-clamp-1">{order.skuName}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{order.quantity} {locale === 'fr' ? 'unités' : 'units'}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-bold text-slate-900">{formatCAD(order.total)}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={order.shipmentStatus} locale={locale} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick actions */}
            <div className="card p-5">
              <h3 className="font-bold text-slate-900 mb-4">{t.dashboard.quickActions}</h3>
              <div className="space-y-2">
                <Link href={`/${locale}/pools/create`} className="flex items-center gap-3 p-3 rounded-xl bg-accent-50 hover:bg-accent-100 transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-accent-500 flex items-center justify-center flex-shrink-0">
                    <Plus className="text-white" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.dashboard.createPool}</p>
                    <p className="text-xs text-slate-500">{t.dashboard.createPoolDesc}</p>
                  </div>
                  <ArrowRight size={14} className="text-slate-400 ml-auto group-hover:text-slate-600" />
                </Link>
                <Link href={`/${locale}/pools`} className="flex items-center gap-3 p-3 rounded-xl bg-brand-50 hover:bg-brand-100 transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
                    <Package className="text-white" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.dashboard.browsePools}</p>
                    <p className="text-xs text-slate-500">{t.dashboard.openPoolsCount}</p>
                  </div>
                  <ArrowRight size={14} className="text-slate-400 ml-auto group-hover:text-slate-600" />
                </Link>
              </div>
            </div>

            {/* Recommended pools */}
            <div className="card p-5">
              <h3 className="font-bold text-slate-900 mb-4">{t.dashboard.recommended}</h3>
              <div className="space-y-3">
                {recommendedPools.map((pool) => {
                  const tier = getCurrentTier(pool.offer.tiers, pool.committedQty)
                  const savings = getSavingsPct(pool.soloPrice, tier.unitPrice)
                  return (
                    <Link key={pool.id} href={`/${locale}/pools/${pool.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">
                        {pool.imageEmoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 line-clamp-1">{pool.skuName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{pool.region}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-slate-900">{formatCAD(tier.unitPrice)}</p>
                        <span className="badge-green text-xs">-{savings}%</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Savings summary */}
            <div className="card p-5 bg-gradient-to-br from-success-50 to-emerald-50 border-success-200">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="text-success-600" size={18} />
                <h3 className="font-bold text-slate-900 text-sm">{t.dashboard.savingsYear}</h3>
              </div>
              <div className="text-4xl font-black text-success-700 mb-1">$4,280</div>
              <p className="text-xs text-slate-600 mb-4">{t.dashboard.savingsYearSub}</p>
              <div className="space-y-2">
                {[
                  { label: t.dashboard.savingsCat1, amount: '$2,340' },
                  { label: t.dashboard.savingsCat2, amount: '$890' },
                  { label: t.dashboard.savingsCat3, amount: '$1,050' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-xs">
                    <span className="text-slate-500">{item.label}</span>
                    <span className="font-semibold text-success-700">{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer locale={locale} />
    </div>
  )
}
