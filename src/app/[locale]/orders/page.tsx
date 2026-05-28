'use client'
import Link from 'next/link'
import { type Locale, getTranslation } from '@/lib/i18n'
import Footer from '@/components/Footer'
import { Plus, Package, ArrowLeft, TrendingDown } from 'lucide-react'
import { MOCK_ORDERS, MOCK_POOLS, formatCAD } from '@/lib/mock-data'

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
            <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">MT</div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function StatusBadge({ status, locale }: { status: string; locale: Locale }) {
  const t = getTranslation(locale)
  const statusMap: Record<string, { cls: string; label: string }> = {
    in_transit: { cls: 'badge-orange', label: t.dashboard.status.in_transit },
    delivered: { cls: 'badge-green', label: t.dashboard.status.delivered },
    pending: { cls: 'badge-gray', label: t.dashboard.status.pending },
  }
  const s = statusMap[status] ?? { cls: 'badge-gray', label: status }
  return <span className={s.cls}>{s.label}</span>
}

const enrichedOrders = MOCK_ORDERS.map((o) => {
  const pool = MOCK_POOLS.find((p) => p.id === o.poolId) ?? MOCK_POOLS[0]
  const soloTotal = pool.soloPrice * o.quantity
  const saved = soloTotal - o.total
  return { ...o, pool, saved }
})

export default function OrdersPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const t = getTranslation(locale)
  const to = t.orders

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
          {[
            { label: to.totalOrders, value: MOCK_ORDERS.length.toString() },
            { label: to.deliveredCount, value: MOCK_ORDERS.filter(o => o.shipmentStatus === 'delivered').length.toString() },
            { label: to.inTransitCount, value: MOCK_ORDERS.filter(o => o.shipmentStatus === 'in_transit').length.toString() },
            { label: to.totalSavings, value: formatCAD(enrichedOrders.reduce((acc, o) => acc + o.saved, 0)) },
          ].map((stat) => (
            <div key={stat.label} className="card p-4 text-center">
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {enrichedOrders.length > 0 ? (
          <div className="space-y-4">
            {enrichedOrders.map((order) => (
              <div key={order.id} className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">
                    {order.pool.imageEmoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{order.skuName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          <span className="font-mono font-semibold">{order.id}</span>
                          {' · '}{new Date(order.createdAt).toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <StatusBadge status={order.shipmentStatus} locale={locale} />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
                      <div>
                        <p className="text-slate-400">{to.qty}</p>
                        <p className="font-semibold text-slate-800 mt-0.5">{order.quantity} {to.units}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">{to.total}</p>
                        <p className="font-bold text-slate-900 mt-0.5">{formatCAD(order.total)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">{to.savings}</p>
                        <p className="font-bold text-success-600 mt-0.5 flex items-center gap-0.5">
                          <TrendingDown size={11} />
                          {formatCAD(order.saved)}
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
