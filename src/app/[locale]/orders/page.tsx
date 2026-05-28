'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { type Locale, getTranslation } from '@/lib/i18n'
import Footer from '@/components/Footer'
import UserMenu from '@/components/UserMenu'
import { Plus, Package, ArrowLeft, TrendingDown, Loader2 } from 'lucide-react'

function formatCAD(n: number) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(n)
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
}

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
            <Link href={`/${locale}/dashboard`} className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1">
              <ArrowLeft size={14} /> {t.nav.dashboard}
            </Link>
            <Link href={`/${locale}/pools/create`} className="btn-primary text-sm py-2 px-4">
              <Plus size={15} /> {t.nav.createPool}
            </Link>
            <UserMenu locale={locale} />
          </div>
        </div>
      </div>
    </nav>
  )
}

function StatusBadge({ status, locale }: { status: string; locale: Locale }) {
  const t = getTranslation(locale)
  const statusMap: Record<string, { cls: string; label: string }> = {
    IN_TRANSIT: { cls: 'badge-orange', label: t.dashboard.status.in_transit },
    DELIVERED: { cls: 'badge-green', label: t.dashboard.status.delivered },
    PENDING: { cls: 'badge-gray', label: t.dashboard.status.pending },
    in_transit: { cls: 'badge-orange', label: t.dashboard.status.in_transit },
    delivered: { cls: 'badge-green', label: t.dashboard.status.delivered },
    pending: { cls: 'badge-gray', label: t.dashboard.status.pending },
  }
  const s = statusMap[status] ?? { cls: 'badge-gray', label: status }
  return <span className={s.cls}>{s.label}</span>
}

export default function OrdersPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const t = getTranslation(locale)
  const to = t.orders
  const { data: session } = useSession()
  const user = session?.user as any

  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => { setOrders(d.orders ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const enrichedOrders = orders.map(order => {
    const soloPrice = order.pool?.sku?.soloPrice ?? 0
    const saved = (soloPrice - order.unitPrice) * order.qty
    return { ...order, saved }
  })

  const totalSavings = enrichedOrders.reduce((acc, o) => acc + Math.max(0, o.saved), 0)
  const deliveredCount = orders.filter(o => o.shipmentStatus === 'DELIVERED' || o.shipmentStatus === 'delivered').length
  const inTransitCount = orders.filter(o => o.shipmentStatus === 'IN_TRANSIT' || o.shipmentStatus === 'in_transit').length

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNavbar locale={locale} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{to.title}</h1>
          <p className="text-slate-500 mt-1">{to.sub}</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {loading ? Array(4).fill(0).map((_, i) => (
            <div key={i} className="card p-4 text-center">
              <Skeleton className="h-8 w-16 mx-auto mb-1" />
              <Skeleton className="h-3 w-20 mx-auto" />
            </div>
          )) : [
            { label: to.totalOrders, value: orders.length.toString() },
            { label: to.deliveredCount, value: deliveredCount.toString() },
            { label: to.inTransitCount, value: inTransitCount.toString() },
            { label: to.totalSavings, value: formatCAD(totalSavings) },
          ].map((stat) => (
            <div key={stat.label} className="card p-4 text-center">
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="card p-5">
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        ) : enrichedOrders.length > 0 ? (
          <div className="space-y-4">
            {enrichedOrders.map((order) => (
              <div key={order.id} className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Package size={22} className="text-slate-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          {locale === 'fr' ? order.pool?.sku?.nameFr : order.pool?.sku?.nameEn}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          <span className="font-mono font-semibold">{order.id.slice(0, 12)}…</span>
                          {' · '}{new Date(order.createdAt).toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <StatusBadge status={order.shipmentStatus} locale={locale} />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
                      <div>
                        <p className="text-slate-400">{to.qty}</p>
                        <p className="font-semibold text-slate-800 mt-0.5">{order.qty} {to.units}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">{to.total}</p>
                        <p className="font-bold text-slate-900 mt-0.5">{formatCAD(order.total)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">{to.savings}</p>
                        <p className="font-bold text-success-600 mt-0.5 flex items-center gap-0.5">
                          <TrendingDown size={11} />
                          {formatCAD(Math.max(0, order.saved))}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">{to.tracking}</p>
                        <p className="font-mono text-slate-700 mt-0.5">
                          {order.trackingNumber ?? <span className="text-slate-400 font-sans">—</span>}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/${locale}/pools/${order.poolId}`}
                    className="btn-ghost border border-slate-200 text-xs py-2 px-3 flex-shrink-0 self-center"
                  >
                    {to.viewPool}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Package size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">{to.noOrders}</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">{to.noOrdersDesc}</p>
            <Link href={`/${locale}/pools`} className="btn-primary">
              {to.browseBtn}
            </Link>
          </div>
        )}
      </div>

      <Footer locale={locale} />
    </div>
  )
}
