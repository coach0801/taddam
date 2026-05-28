'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { type Locale, getTranslation } from '@/lib/i18n'
import Footer from '@/components/Footer'
import UserMenu from '@/components/UserMenu'
import {
  TrendingDown, Package, Truck, BarChart3, Plus, ArrowRight,
  Clock, Users, ChevronRight, Loader2
} from 'lucide-react'

function formatCAD(n: number) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(n)
}

function StatusBadge({ status, locale }: { status: string; locale: Locale }) {
  const t = getTranslation(locale)
  const colors: Record<string, string> = {
    OPEN: 'badge-blue', FILLING: 'badge-blue',
    FULFILLING: 'badge-orange', COMPLETED: 'badge-green',
    FAILED: 'badge-red', IN_TRANSIT: 'badge-orange',
    DELIVERED: 'badge-green', PENDING: 'badge-gray',
  }
  const labels: Record<string, string> = {
    OPEN: t.dashboard.status.open, FILLING: t.dashboard.status.open,
    FULFILLING: t.dashboard.status.fulfilling, COMPLETED: t.dashboard.status.completed,
    FAILED: t.dashboard.status.failed, IN_TRANSIT: t.dashboard.status.in_transit,
    DELIVERED: t.dashboard.status.delivered, PENDING: t.dashboard.status.pending,
  }
  return <span className={colors[status] || 'badge-gray'}>{labels[status] || status}</span>
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
}

export default function DashboardPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const t = getTranslation(locale)
  const { data: session } = useSession()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const user = session?.user as any
  const businessName = user?.businessName ?? '…'
  const stats = data?.stats ?? {}
  const orders = data?.orders ?? []
  const activeCommitments = data?.activeCommitments ?? []
  const totalSavings = data?.totalSavingsCAD ?? 0

  return (
    <div className="min-h-screen bg-slate-50">
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
              <UserMenu locale={locale} />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {t.dashboard.greeting}, {user?.name?.split(' ')[0] ?? '…'}
          </h1>
          <p className="text-slate-500 mt-1">{businessName} · {t.dashboard.verifiedBuyer}</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {loading ? Array(4).fill(0).map((_, i) => (
            <div key={i} className="card p-5">
              <Skeleton className="w-10 h-10 rounded-xl mb-3" />
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          )) : [
            { icon: TrendingDown, value: formatCAD(totalSavings), label: t.dashboard.savingsTitle, sub: t.dashboard.savingsSub, color: 'text-success-600', bg: 'bg-success-50', change: t.dashboard.savingsChange, changeColor: 'text-success-600' },
            { icon: Package, value: String(stats.activeCommitments ?? 0), label: t.dashboard.activePoolsTitle, sub: t.dashboard.activePoolsSub, color: 'text-brand-600', bg: 'bg-brand-50', change: t.dashboard.activePoolsChange, changeColor: 'text-brand-600' },
            { icon: BarChart3, value: String(stats.totalOrders ?? 0), label: t.dashboard.ordersTitle, sub: t.dashboard.ordersSub, color: 'text-accent-600', bg: 'bg-accent-50', change: t.dashboard.ordersChange, changeColor: 'text-accent-600' },
            { icon: Truck, value: String(stats.inTransit ?? 0), label: t.dashboard.pendingTitle, sub: t.dashboard.pendingSub, color: 'text-violet-600', bg: 'bg-violet-50', change: t.dashboard.pendingChange, changeColor: 'text-violet-600' },
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
            {/* Active commitments */}
            {activeCommitments.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900">{t.dashboard.myPools}</h2>
                  <Link href={`/${locale}/pools`} className="text-sm text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1">
                    {t.dashboard.viewAll} <ChevronRight size={14} />
                  </Link>
                </div>
                <div className="space-y-4">
                  {activeCommitments.map((c: any) => {
                    const pool = c.pool
                    const pct = Math.round((pool.committedQty / pool.targetQty) * 100)
                    const timeLeft = new Date(pool.closesAt).getTime() - Date.now()
                    const daysLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60 * 24)))
                    const hoursLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))

                    return (
                      <Link key={c.id} href={`/${locale}/pools/${pool.id}`} className="card p-5 block hover:border-brand-200 transition-colors">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                              <Package size={20} className="text-slate-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 text-sm leading-tight">{locale === 'fr' ? pool.sku.nameFr : pool.sku.nameEn}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{pool.sku.category} · {pool.supplier.companyName}</p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-lg font-black text-slate-900">{formatCAD(c.unitPrice)}</div>
                            <span className="badge-green text-xs">
                              {pool.sku.soloPrice > 0 ? `↓ ${Math.round(((pool.sku.soloPrice - c.unitPrice) / pool.sku.soloPrice) * 100)}%` : ''}
                            </span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                            <span>{pool.committedQty} / {pool.targetQty} units</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="progress-bar h-2">
                            <div className={`progress-fill ${pct >= 80 ? 'pool-progress-high' : pct >= 50 ? 'pool-progress-mid' : 'pool-progress-low'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Users size={12} />{pool.participantCount} participants</span>
                          <span className="flex items-center gap-1"><Clock size={12} />{daysLeft}d {hoursLeft}h {t.dashboard.remaining}</span>
                          <span className="text-brand-600 font-medium">{t.dashboard.viewPool}</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Recent orders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">{t.dashboard.recentOrders}</h2>
                <Link href={`/${locale}/orders`} className="text-sm text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1">
                  {t.dashboard.viewAll} <ChevronRight size={14} />
                </Link>
              </div>
              {loading ? (
                <div className="card p-5 space-y-3">
                  {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : orders.length === 0 ? (
                <div className="card p-8 text-center">
                  <Package size={36} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">{t.dashboard.noActivePools}</p>
                  <Link href={`/${locale}/pools`} className="btn-primary text-sm mt-4">{t.dashboard.browsePools}</Link>
                </div>
              ) : (
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
                      {orders.map((order: any) => (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-3.5">
                            <p className="text-xs font-mono font-semibold text-slate-900">{order.id.slice(0, 12)}…</p>
                            <p className="text-xs text-slate-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA')}</p>
                          </td>
                          <td className="px-5 py-3.5 hidden sm:table-cell">
                            <p className="text-xs text-slate-700 font-medium line-clamp-1">{locale === 'fr' ? order.pool.sku.nameFr : order.pool.sku.nameEn}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{order.qty} {locale === 'fr' ? 'unités' : 'units'}</p>
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
              )}
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

            {/* Savings summary */}
            <div className="card p-5 bg-gradient-to-br from-success-50 to-emerald-50 border-success-200">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="text-success-600" size={18} />
                <h3 className="font-bold text-slate-900 text-sm">{t.dashboard.savingsYear}</h3>
              </div>
              {loading ? <Skeleton className="h-10 w-32 mb-1" /> : (
                <div className="text-4xl font-black text-success-700 mb-1">{formatCAD(totalSavings)}</div>
              )}
              <p className="text-xs text-slate-600">{t.dashboard.savingsYearSub}</p>
            </div>
          </div>
        </div>
      </div>

      <Footer locale={locale} />
    </div>
  )
}
