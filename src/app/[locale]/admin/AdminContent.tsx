'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { type Locale, getTranslation } from '@/lib/i18n'
import Footer from '@/components/Footer'
import Modal from '@/components/Modal'
import { useToast } from '@/components/Toast'
import UserMenu from '@/components/UserMenu'
import {
  Shield, AlertTriangle, CheckCircle2, XCircle, Users, Package,
  DollarSign, TrendingUp, Settings, RefreshCw, Clock, Filter,
  Eye, MessageSquare, Plus, Trash2, Tag, Loader2
} from 'lucide-react'

function formatCAD(n: number) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(n)
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
}

function AppNavbar({ locale }: { locale: Locale }) {
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
          <div className="flex items-center gap-3">
            <span className="badge-blue text-xs">Admin</span>
            <UserMenu locale={locale} dark={true} fallbackInitials="AD" />
          </div>
        </div>
      </div>
    </nav>
  )
}

type ModalType =
  | { type: 'approve'; id: string; org: string }
  | { type: 'reject'; id: string; org: string }
  | { type: 'request'; id: string; org: string }
  | { type: 'intervene'; id: string; name: string }
  | { type: 'config'; label: string; value: string; desc: string }
  | null

const ledgerTypeColors: Record<string, string> = {
  capture: 'badge-blue',
  commission: 'badge-green',
  transfer: 'badge-orange',
  refund: 'badge-red',
  hold: 'badge-gray',
}

export default function AdminContent({ locale }: { locale: Locale }) {
  const t = getTranslation(locale)
  const ta = t.admin
  const { addToast } = useToast()

  const [tab, setTab] = useState<'verifications' | 'pools' | 'orders' | 'config'>('verifications')
  const [modal, setModal] = useState<ModalType>(null)
  const [loading, setLoading] = useState(true)

  // API data
  const [pendingSuppliers, setPendingSuppliers] = useState<any[]>([])
  const [activePools, setActivePools] = useState<any[]>([])
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})

  // Modal form state
  const [approveNote, setApproveNote] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [requestMsg, setRequestMsg] = useState('')
  const [interveneAction, setInterveneAction] = useState<'close' | 'extend'>('close')
  const [interveneNote, setInterveneNote] = useState('')
  const [configValue, setConfigValue] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const [configRows] = useState([
    { label: 'Default commission rate', value: '5%', desc: 'Applied to all transactions. Configurable per supplier.' },
    { label: 'Minimum pool duration', value: '2 days', desc: 'Pools must remain open for at least this long.' },
    { label: 'Payment hold expiry', value: '14 days', desc: 'Authorization holds released after this period if pool fails.' },
    { label: 'Delivery release window', value: '7 days', desc: 'Dispute window after delivery before automatic fund release.' },
    { label: 'Buyer verification', value: 'BN + email domain', desc: 'Requirements for buyer accounts to participate in pools.' },
    { label: 'Supplier verification', value: 'Manual review + Stripe KYC', desc: 'Requirements before a supplier offer goes live.' },
  ])

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/suppliers').then(r => r.json()),
      fetch('/api/admin/pools').then(r => r.json()),
    ]).then(([suppData, poolData]) => {
      setPendingSuppliers(suppData.suppliers?.filter((s: any) => s.status === 'PENDING') ?? [])
      setActivePools(poolData.activePools ?? [])
      setRecentOrders(poolData.recentOrders ?? [])
      setStats(poolData.stats ?? {})
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const tabs = [
    { id: 'verifications', label: ta.verificationsTab, count: pendingSuppliers.length },
    { id: 'pools', label: ta.poolsTab, count: activePools.length },
    { id: 'orders', label: locale === 'fr' ? 'Commandes récentes' : 'Recent Orders', count: null },
    { id: 'config', label: ta.configTab, count: null },
  ] as const

  const closeModal = () => {
    setModal(null)
    setApproveNote('')
    setRejectReason('')
    setRequestMsg('')
    setInterveneNote('')
    setConfigValue('')
  }

  const handleApprove = async () => {
    if (modal?.type !== 'approve') return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/suppliers`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplierId: modal.id, status: 'APPROVED', note: approveNote }),
      })
      if (res.ok) {
        setPendingSuppliers(v => v.filter(x => x.id !== modal.id))
        addToast(`${modal.org} ${locale === 'fr' ? 'approuvé avec succès.' : 'approved successfully.'}`, 'success')
      } else {
        addToast(locale === 'fr' ? 'Erreur lors de l\'approbation.' : 'Error approving supplier.', 'error')
      }
    } catch {
      addToast(locale === 'fr' ? 'Erreur réseau.' : 'Network error.', 'error')
    }
    setActionLoading(false)
    closeModal()
  }

  const handleReject = async () => {
    if (modal?.type !== 'reject' || !rejectReason.trim()) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/suppliers`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplierId: modal.id, status: 'REJECTED', note: rejectReason }),
      })
      if (res.ok) {
        setPendingSuppliers(v => v.filter(x => x.id !== modal.id))
        addToast(`${modal.org} ${locale === 'fr' ? 'rejeté.' : 'rejected.'}`, 'info')
      }
    } catch {}
    setActionLoading(false)
    closeModal()
  }

  const handleRequest = () => {
    closeModal()
    addToast(locale === 'fr' ? 'Demande d\'informations envoyée.' : 'Information request sent.', 'info')
  }

  const handleIntervene = () => {
    closeModal()
    addToast(
      interveneAction === 'close'
        ? (locale === 'fr' ? 'Groupe fermé et marqué comme échoué.' : 'Pool closed and marked as failed.')
        : (locale === 'fr' ? 'Délai du groupe prolongé de 3 jours.' : 'Pool deadline extended by 3 days.'),
      'success'
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNavbar locale={locale} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{ta.title}</h1>
          <p className="text-slate-500 mt-1">{ta.sub}</p>
        </div>

        {/* Platform stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading ? Array(4).fill(0).map((_, i) => (
            <div key={i} className="card p-5">
              <Skeleton className="w-10 h-10 rounded-xl mb-3" />
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-4 w-28" />
            </div>
          )) : [
            { icon: AlertTriangle, value: String(pendingSuppliers.length), label: ta.pendingVerifications, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', urgent: pendingSuppliers.length > 0 },
            { icon: Package, value: String(activePools.length), label: ta.activePools, color: 'text-brand-600', bg: 'bg-brand-50', border: 'border-brand-200', urgent: false },
            { icon: AlertTriangle, value: String(stats.openDisputes ?? 0), label: ta.openDisputes, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', urgent: (stats.openDisputes ?? 0) > 0 },
            { icon: DollarSign, value: formatCAD(stats.weeklyGMV ?? 0), label: ta.weeklyGMV, color: 'text-success-600', bg: 'bg-success-50', border: 'border-success-200', urgent: false },
          ].map((s) => (
            <div key={s.label} className={`card p-5 ${s.urgent ? `border-2 ${s.border}` : ''}`}>
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={s.color} size={20} />
              </div>
              <div className={`text-2xl font-black mb-0.5 ${s.urgent ? s.color : 'text-slate-900'}`}>{s.value}</div>
              <div className="text-xs font-semibold text-slate-700">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Platform metrics */}
        {!loading && (
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: locale === 'fr' ? 'Taux de réussite (30j)' : 'Pool fill rate (30d)', value: `${stats.poolFillRate ?? 0}%`, sub: locale === 'fr' ? 'groupes réussis' : 'pools succeeded', icon: TrendingUp, color: 'text-success-600' },
              { label: locale === 'fr' ? 'Économies moyennes' : 'Avg. savings delivered', value: `${stats.avgSavingsPct ?? 0}%`, sub: locale === 'fr' ? 'vs. prix individuel' : 'vs. solo purchase price', icon: TrendingUp, color: 'text-brand-600' },
              { label: locale === 'fr' ? 'Taux de commission' : 'Take rate', value: '5.0%', sub: locale === 'fr' ? 'Commission en % du GMV' : 'Commission as % of GMV', icon: DollarSign, color: 'text-accent-600' },
            ].map((m) => (
              <div key={m.label} className="card p-5 flex items-center gap-4">
                <div className={`text-3xl font-black ${m.color}`}>{m.value}</div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{m.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{m.sub}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6 gap-1 overflow-x-auto">
          {tabs.map((t2) => (
            <button
              key={t2.id}
              onClick={() => setTab(t2.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-t-lg transition-all border-b-2 -mb-px whitespace-nowrap ${
                tab === t2.id
                  ? 'text-brand-700 border-brand-700 bg-brand-50'
                  : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >
              {t2.label}
              {t2.count !== null && t2.count > 0 && (
                <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${tab === t2.id ? 'bg-brand-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {t2.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Verifications tab */}
        {tab === 'verifications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-500">{pendingSuppliers.length} {locale === 'fr' ? 'en attente de révision' : 'pending review'}</p>
            </div>
            {loading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => <div key={i} className="card p-6"><Skeleton className="h-20 w-full" /></div>)}
              </div>
            ) : pendingSuppliers.length === 0 ? (
              <div className="text-center py-16">
                <CheckCircle2 size={48} className="text-success-400 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">{locale === 'fr' ? 'Toutes les vérifications sont à jour!' : 'All verifications are up to date!'}</p>
              </div>
            ) : (
              pendingSuppliers.map((supplier) => (
                <div key={supplier.id} className="card p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900">{supplier.companyName}</h3>
                        <span className="badge-orange">{locale === 'fr' ? 'Fournisseur' : 'Supplier'}</span>
                        <span className="badge-gray">{locale === 'fr' ? 'En attente' : 'Pending'}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-1">
                        <span>BN: <strong className="text-slate-700 font-mono">{supplier.taxNumber}</strong></span>
                        {supplier.website && <span>Web: <strong className="text-slate-700">{supplier.website}</strong></span>}
                        <span>{locale === 'fr' ? 'Soumis' : 'Applied'}: <strong className="text-slate-700">{new Date(supplier.createdAt).toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA')}</strong></span>
                      </div>
                      {supplier.description && (
                        <p className="text-sm text-slate-600 mt-3 p-3 bg-slate-50 rounded-lg">{supplier.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0 flex-wrap">
                      <button
                        onClick={() => setModal({ type: 'approve', id: supplier.id, org: supplier.companyName })}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-success-600 text-white text-xs font-semibold hover:bg-success-700 transition-colors"
                      >
                        <CheckCircle2 size={13} /> {ta.approve}
                      </button>
                      <button
                        onClick={() => setModal({ type: 'reject', id: supplier.id, org: supplier.companyName })}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
                      >
                        <XCircle size={13} /> {ta.reject}
                      </button>
                      <button
                        onClick={() => setModal({ type: 'request', id: supplier.id, org: supplier.companyName })}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                      >
                        <MessageSquare size={13} /> {ta.requestInfo}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pools tab */}
        {tab === 'pools' && (
          <div className="card overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">
                {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : activePools.length === 0 ? (
              <div className="text-center py-16">
                <Package size={48} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">{locale === 'fr' ? 'Aucun groupe actif' : 'No active pools'}</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">{locale === 'fr' ? 'Groupe' : 'Pool'}</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">{locale === 'fr' ? 'Fournisseur' : 'Supplier'}</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">{locale === 'fr' ? 'Progression' : 'Progress'}</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">{locale === 'fr' ? 'Fermeture' : 'Closes'}</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">{locale === 'fr' ? 'État' : 'Status'}</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activePools.map((pool: any) => {
                    const pct = Math.round((pool.committedQty / pool.targetQty) * 100)
                    return (
                      <tr key={pool.id} className="hover:bg-slate-50">
                        <td className="px-5 py-4">
                          <div>
                            <p className="text-xs font-semibold text-slate-800 line-clamp-1 max-w-48">
                              {locale === 'fr' ? pool.sku?.nameFr : pool.sku?.nameEn}
                            </p>
                            <p className="text-xs text-slate-400">{pool.participantCount} {locale === 'fr' ? 'participants' : 'participants'}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden sm:table-cell text-xs text-slate-600">{pool.supplier?.companyName}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-200 rounded-full h-1.5">
                              <div className="h-1.5 rounded-full pool-progress-mid" style={{ width: `${Math.min(pct, 100)}%` }} />
                            </div>
                            <span className="text-xs text-slate-600 font-medium">{pct}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell text-xs text-slate-500">
                          {new Date(pool.closesAt).toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA')}
                        </td>
                        <td className="px-5 py-4"><span className="badge-blue">{pool.status}</span></td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setModal({ type: 'intervene', id: pool.id, name: locale === 'fr' ? pool.sku?.nameFr : pool.sku?.nameEn })}
                            className="text-brand-600 text-xs font-medium hover:underline whitespace-nowrap"
                          >
                            {ta.intervene}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Orders tab */}
        {tab === 'orders' && (
          <div className="card overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">
                {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-16">
                <Package size={48} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">{locale === 'fr' ? 'Aucune commande récente' : 'No recent orders'}</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">{locale === 'fr' ? 'Commande' : 'Order'}</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">{locale === 'fr' ? 'Acheteur' : 'Buyer'}</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">{locale === 'fr' ? 'Total' : 'Total'}</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">{locale === 'fr' ? 'Statut' : 'Status'}</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">{locale === 'fr' ? 'Date' : 'Date'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3.5">
                        <p className="text-xs font-mono font-semibold text-slate-900">{order.id.slice(0, 12)}…</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {locale === 'fr' ? order.pool?.sku?.nameFr : order.pool?.sku?.nameEn}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell text-xs text-slate-600">
                        {order.user?.name ?? order.user?.email}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-sm text-slate-900">{formatCAD(order.total)}</td>
                      <td className="px-5 py-3.5">
                        <span className={order.shipmentStatus === 'DELIVERED' ? 'badge-green' : order.shipmentStatus === 'IN_TRANSIT' ? 'badge-orange' : 'badge-gray'}>
                          {order.shipmentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Config tab */}
        {tab === 'config' && (
          <div className="max-w-2xl space-y-6">
            {configRows.map((cfg) => (
              <div key={cfg.label} className="card p-5 flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">{cfg.label}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{cfg.desc}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="badge-blue font-mono">{cfg.value}</span>
                  <button
                    onClick={() => { setConfigValue(cfg.value); setModal({ type: 'config', label: cfg.label, value: cfg.value, desc: cfg.desc }) }}
                    className="btn-ghost text-xs border border-slate-200"
                  >
                    <Settings size={13} /> {locale === 'fr' ? 'Modifier' : 'Edit'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer locale={locale} />

      {/* Modals */}
      {modal?.type === 'approve' && (
        <Modal title={ta.approveTitle} onClose={closeModal}>
          <div className="space-y-4">
            <div className="p-4 bg-success-50 border border-success-200 rounded-xl text-sm text-success-700">
              {locale === 'fr' ? 'Approuver :' : 'Approving:'} <strong>{modal.org}</strong>
            </div>
            <div>
              <label className="label">{ta.approveNote}</label>
              <textarea className="input min-h-24 resize-none" value={approveNote} onChange={e => setApproveNote(e.target.value)} placeholder={locale === 'fr' ? 'Optionnel…' : 'Optional…'} />
            </div>
            <div className="flex gap-3">
              <button onClick={closeModal} className="btn-ghost border border-slate-200 flex-1">{ta.cancelBtn}</button>
              <button onClick={handleApprove} disabled={actionLoading} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-success-600 hover:bg-success-700 transition-colors disabled:opacity-50">
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                {ta.approve}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {modal?.type === 'reject' && (
        <Modal title={ta.rejectTitle} onClose={closeModal}>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {locale === 'fr' ? 'Rejeter :' : 'Rejecting:'} <strong>{modal.org}</strong>
            </div>
            <div>
              <label className="label">{ta.rejectReason} <span className="text-red-500">*</span></label>
              <textarea className="input min-h-24 resize-none" value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder={locale === 'fr' ? 'Raison requise…' : 'Required…'} />
            </div>
            <div className="flex gap-3">
              <button onClick={closeModal} className="btn-ghost border border-slate-200 flex-1">{ta.cancelBtn}</button>
              <button onClick={handleReject} disabled={!rejectReason.trim() || actionLoading} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                {ta.reject}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {modal?.type === 'request' && (
        <Modal title={ta.requestInfo} onClose={closeModal}>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">{locale === 'fr' ? 'Envoyer une demande d\'information à' : 'Send an information request to'} <strong>{modal.org}</strong>.</p>
            <div>
              <label className="label">{locale === 'fr' ? 'Message' : 'Message'}</label>
              <textarea className="input min-h-28 resize-none" value={requestMsg} onChange={e => setRequestMsg(e.target.value)} placeholder={locale === 'fr' ? 'Précisez les informations requises…' : 'Specify the information required…'} />
            </div>
            <div className="flex gap-3">
              <button onClick={closeModal} className="btn-ghost border border-slate-200 flex-1">{ta.cancelBtn}</button>
              <button onClick={handleRequest} className="btn-primary flex-1">
                <MessageSquare size={16} /> {locale === 'fr' ? 'Envoyer' : 'Send'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {modal?.type === 'intervene' && (
        <Modal title={ta.interveneTitle} onClose={closeModal}>
          <div className="space-y-4">
            <p className="text-sm font-semibold text-slate-700">{modal.name}</p>
            <div>
              <label className="label">{ta.interveneAction}</label>
              <div className="space-y-2">
                {([
                  { value: 'close' as const, label: ta.interveneClose },
                  { value: 'extend' as const, label: ta.interveneExtend },
                ]).map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setInterveneAction(opt.value)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left text-sm transition-all ${interveneAction === opt.value ? 'border-brand-500 bg-brand-50 text-brand-700 font-semibold' : 'border-slate-200 text-slate-600'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">{ta.interveneNote}</label>
              <textarea className="input min-h-20 resize-none" value={interveneNote} onChange={e => setInterveneNote(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <button onClick={closeModal} className="btn-ghost border border-slate-200 flex-1">{ta.cancelBtn}</button>
              <button onClick={handleIntervene} className="btn-primary flex-1">{locale === 'fr' ? 'Confirmer' : 'Confirm'}</button>
            </div>
          </div>
        </Modal>
      )}

      {modal?.type === 'config' && (
        <Modal title={ta.configEditTitle} onClose={closeModal}>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">{modal.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{modal.desc}</p>
            </div>
            <div>
              <label className="label">{ta.configNewValue}</label>
              <input type="text" className="input" value={configValue} onChange={e => setConfigValue(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <button onClick={closeModal} className="btn-ghost border border-slate-200 flex-1">{ta.cancelBtn}</button>
              <button disabled={!configValue.trim()} className="btn-primary flex-1">
                <Settings size={16} /> {locale === 'fr' ? 'Enregistrer' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
