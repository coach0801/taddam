'use client'
import { useState } from 'react'
import Link from 'next/link'
import { type Locale, getTranslation } from '@/lib/i18n'
import Footer from '@/components/Footer'
import Modal from '@/components/Modal'
import { useToast } from '@/components/Toast'
import {
  Shield, AlertTriangle, CheckCircle2, XCircle, Users, Package,
  DollarSign, TrendingUp, Settings, RefreshCw, Clock, Filter,
  Eye, MessageSquare, Plus, Trash2, Tag
} from 'lucide-react'
import { MOCK_VERIFICATIONS, MOCK_POOLS, MOCK_SKUS, CATEGORIES, formatCAD, getCurrentTier } from '@/lib/mock-data'

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
            <div className="w-9 h-9 rounded-full bg-brand-700 flex items-center justify-center text-white font-bold text-sm">AD</div>
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
  | { type: 'resolve'; id: string; issue: string; amount: number }
  | { type: 'refund'; id: string; buyer: string; amount: number }
  | { type: 'config'; label: string; value: string; desc: string }
  | { type: 'addCategory' }
  | { type: 'addSku' }
  | null

const mockLedger = [
  { id: 'TXN-0291', date: '2025-05-24', type: 'capture', party: 'Atelier Tremblay Auto', amount: 1844, ref: 'pi_3abc123' },
  { id: 'TXN-0290', date: '2025-05-24', type: 'commission', party: 'taddam', amount: 98, ref: 'pi_3abc123' },
  { id: 'TXN-0289', date: '2025-05-24', type: 'transfer', party: 'Pacific Parts Distribution', amount: 1746, ref: 'py_3def456' },
  { id: 'TXN-0288', date: '2025-05-22', type: 'capture', party: 'Kowalski Construction', amount: 975, ref: 'pi_3ghi789' },
  { id: 'TXN-0287', date: '2025-05-22', type: 'commission', party: 'taddam', amount: 49, ref: 'pi_3ghi789' },
  { id: 'TXN-0286', date: '2025-05-21', type: 'refund', party: 'La Cuisine du Marché', amount: -380, ref: 're_3jkl012' },
]

const mockDisputes = [
  {
    id: 'DIS-001',
    order: 'ORD-2025-001204',
    buyer: 'Dupont Plomberie',
    supplier: 'Pacific Parts Distribution',
    issue: 'Wrong size delivered — ordered 205/55R16, received 215/55R16',
    amount: 2460,
    raised: '2025-05-22',
    status: 'open',
  },
]

const ledgerTypeColors: Record<string, string> = {
  capture: 'badge-blue',
  commission: 'badge-green',
  transfer: 'badge-orange',
  refund: 'badge-red',
  hold: 'badge-gray',
}

function downloadCSV() {
  const headers = ['TX ID', 'Date', 'Type', 'Party', 'Amount (CAD)', 'Stripe Ref']
  const rows = mockLedger.map(tx => [
    tx.id, tx.date, tx.type, tx.party,
    tx.amount < 0 ? `-${Math.abs(tx.amount).toFixed(2)}` : tx.amount.toFixed(2),
    tx.ref,
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `taddam-ledger-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const t = getTranslation(locale)
  const ta = t.admin
  const { addToast } = useToast()

  const [tab, setTab] = useState<'verifications' | 'pools' | 'disputes' | 'ledger' | 'taxonomy' | 'config'>('verifications')
  const [modal, setModal] = useState<ModalType>(null)
  const [verifications, setVerifications] = useState(MOCK_VERIFICATIONS)

  // Modal form state
  const [approveNote, setApproveNote] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [requestMsg, setRequestMsg] = useState('')
  const [interveneAction, setInterveneAction] = useState<'close' | 'extend'>('close')
  const [interveneNote, setInterveneNote] = useState('')
  const [resolveOutcome, setResolveOutcome] = useState<'supplier' | 'buyer'>('supplier')
  const [resolveNote, setResolveNote] = useState('')
  const [refundAmount, setRefundAmount] = useState('')
  const [refundReason, setRefundReason] = useState('')
  const [configValue, setConfigValue] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newSkuName, setNewSkuName] = useState('')

  const [configRows, setConfigRows] = useState([
    { label: 'Default commission rate', value: '5%', desc: 'Applied to all transactions. Configurable per supplier.' },
    { label: 'Minimum pool duration', value: '2 days', desc: 'Pools must remain open for at least this long.' },
    { label: 'Payment hold expiry', value: '14 days', desc: 'Authorization holds released after this period if pool fails.' },
    { label: 'Delivery release window', value: '7 days', desc: 'Dispute window after delivery before automatic fund release.' },
    { label: 'Buyer light verification', value: 'BN + email domain', desc: 'Requirements for buyer accounts to participate in pools.' },
    { label: 'Supplier verification', value: 'Manual review + Stripe KYC', desc: 'Requirements before a supplier offer goes live.' },
  ])

  const tabs = [
    { id: 'verifications', label: ta.verificationsTab, count: verifications.length },
    { id: 'pools', label: ta.poolsTab, count: 5 },
    { id: 'disputes', label: ta.disputesTab, count: 1 },
    { id: 'ledger', label: ta.ledgerTab, count: null },
    { id: 'taxonomy', label: ta.taxonomyTab, count: null },
    { id: 'config', label: ta.configTab, count: null },
  ] as const

  const closeModal = () => {
    setModal(null)
    setApproveNote('')
    setRejectReason('')
    setRequestMsg('')
    setInterveneNote('')
    setResolveNote('')
    setRefundAmount('')
    setRefundReason('')
    setConfigValue('')
    setNewCategoryName('')
    setNewSkuName('')
  }

  const handleApprove = () => {
    if (modal?.type !== 'approve') return
    setVerifications(v => v.filter(x => x.id !== modal.id))
    closeModal()
    addToast(`${modal.org} approved successfully.`, 'success')
  }

  const handleReject = () => {
    if (modal?.type !== 'reject' || !rejectReason.trim()) return
    setVerifications(v => v.filter(x => x.id !== modal.id))
    closeModal()
    addToast(`${modal.org} rejected.`, 'info')
  }

  const handleRequest = () => {
    closeModal()
    addToast('Information request sent.', 'info')
  }

  const handleIntervene = () => {
    closeModal()
    addToast(interveneAction === 'close' ? 'Pool closed and marked as failed.' : 'Pool deadline extended by 3 days.', 'success')
  }

  const handleResolve = () => {
    closeModal()
    addToast(resolveOutcome === 'supplier' ? 'Funds released to supplier.' : 'Full refund issued to buyer.', 'success')
  }

  const handleRefund = () => {
    if (!refundAmount) return
    closeModal()
    addToast(`Refund of ${formatCAD(Number(refundAmount))} issued.`, 'success')
  }

  const handleConfigSave = () => {
    if (modal?.type !== 'config' || !configValue.trim()) return
    setConfigRows(rows => rows.map(r =>
      r.label === modal.label ? { ...r, value: configValue } : r
    ))
    closeModal()
    addToast('Configuration saved.', 'success')
  }

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return
    closeModal()
    addToast(`Category "${newCategoryName}" added.`, 'success')
  }

  const handleAddSku = () => {
    if (!newSkuName.trim()) return
    closeModal()
    addToast(`SKU "${newSkuName}" added.`, 'success')
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
          {[
            { icon: AlertTriangle, value: verifications.length.toString(), label: ta.pendingVerifications, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', urgent: verifications.length > 0 },
            { icon: Package, value: '5', label: ta.activePools, color: 'text-brand-600', bg: 'bg-brand-50', border: 'border-brand-200', urgent: false },
            { icon: AlertTriangle, value: '1', label: ta.openDisputes, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', urgent: true },
            { icon: DollarSign, value: '$94,280', label: ta.weeklyGMV, color: 'text-success-600', bg: 'bg-success-50', border: 'border-success-200', urgent: false },
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
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: locale === 'fr' ? 'Taux de réussite des groupes (30j)' : 'Pool fill rate (30d)', value: '78%', sub: locale === 'fr' ? '39 des 50 groupes ont réussi' : '39 of 50 pools succeeded', icon: TrendingUp, color: 'text-success-600' },
            { label: locale === 'fr' ? 'Économies moyennes livrées' : 'Avg. savings delivered', value: '24%', sub: locale === 'fr' ? 'vs. prix individuel' : 'vs. solo purchase price', icon: TrendingUp, color: 'text-brand-600' },
            { label: locale === 'fr' ? 'Taux de commission' : 'Take rate', value: '5.1%', sub: locale === 'fr' ? 'Commission en % du GMV' : 'Commission as % of GMV', icon: DollarSign, color: 'text-accent-600' },
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

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6 gap-1 overflow-x-auto">
          {tabs.map((t2) => (
            <button
              key={t2.id}
              onClick={() => setTab(t2.id as any)}
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
              <p className="text-sm text-slate-500">{verifications.length} {locale === 'fr' ? 'en attente de révision' : 'pending review'}</p>
              <button className="btn-ghost text-xs gap-1.5">
                <Filter size={13} /> {locale === 'fr' ? 'Filtrer' : 'Filter'}
              </button>
            </div>
            {verifications.length === 0 && (
              <div className="text-center py-16">
                <CheckCircle2 size={48} className="text-success-400 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">{locale === 'fr' ? 'Toutes les vérifications sont à jour!' : 'All verifications are up to date!'}</p>
              </div>
            )}
            {verifications.map((v) => (
              <div key={v.id} className="card p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900">{v.org}</h3>
                      <span className={v.type === 'supplier' ? 'badge-orange' : 'badge-blue'}>
                        {v.type === 'supplier' ? (locale === 'fr' ? 'Fournisseur' : 'Supplier') : (locale === 'fr' ? 'Acheteur' : 'Buyer')}
                      </span>
                      <span className="badge-gray">{locale === 'fr' ? 'En attente' : 'Pending'}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-1">
                      <span>{locale === 'fr' ? 'Province' : 'Province'}: <strong className="text-slate-700">{v.province}</strong></span>
                      <span>BN: <strong className="text-slate-700 font-mono">{v.bn}</strong></span>
                      <span>{locale === 'fr' ? 'Soumis' : 'Submitted'}: <strong className="text-slate-700">{v.submitted}</strong></span>
                    </div>
                    <p className="text-sm text-slate-600 mt-3 p-3 bg-slate-50 rounded-lg">{v.notes}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 flex-wrap">
                    <button
                      onClick={() => setModal({ type: 'approve', id: v.id, org: v.org })}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-success-600 text-white text-xs font-semibold hover:bg-success-700 transition-colors"
                    >
                      <CheckCircle2 size={13} /> {ta.approve}
                    </button>
                    <button
                      onClick={() => setModal({ type: 'reject', id: v.id, org: v.org })}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
                    >
                      <XCircle size={13} /> {ta.reject}
                    </button>
                    <button
                      onClick={() => setModal({ type: 'request', id: v.id, org: v.org })}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                    >
                      <MessageSquare size={13} /> {ta.requestInfo}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pools tab */}
        {tab === 'pools' && (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">{locale === 'fr' ? 'Groupe' : 'Pool'}</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">{locale === 'fr' ? 'Région' : 'Region'}</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">{locale === 'fr' ? 'Progression' : 'Progress'}</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">{locale === 'fr' ? 'Fermeture' : 'Closes'}</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">{locale === 'fr' ? 'État' : 'State'}</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_POOLS.map((pool) => {
                  const pct = Math.round((pool.committedQty / pool.targetQty) * 100)
                  const tier = getCurrentTier(pool.offer.tiers, pool.committedQty)
                  return (
                    <tr key={pool.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{pool.imageEmoji}</span>
                          <div>
                            <p className="text-xs font-semibold text-slate-800 line-clamp-1 max-w-48">{pool.skuName}</p>
                            <p className="text-xs text-slate-400">{pool.participantCount} {locale === 'fr' ? 'participants' : 'participants'} · {formatCAD(tier.unitPrice)}/unit</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell text-sm text-slate-600">{pool.region}</td>
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
                      <td className="px-5 py-4"><span className="badge-blue">{locale === 'fr' ? 'Ouvert' : 'Open'}</span></td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setModal({ type: 'intervene', id: pool.id, name: pool.skuName })}
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
          </div>
        )}

        {/* Disputes tab */}
        {tab === 'disputes' && (
          <div className="space-y-4">
            {mockDisputes.map((d) => (
              <div key={d.id} className="card p-6 border-l-4 border-red-500">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{d.id}</span>
                      <span className="badge-red">{locale === 'fr' ? 'Litige ouvert' : 'Open dispute'}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">{d.issue}</h3>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                      <span>{locale === 'fr' ? 'Commande' : 'Order'}: <strong className="text-slate-700">{d.order}</strong></span>
                      <span>{locale === 'fr' ? 'Acheteur' : 'Buyer'}: <strong className="text-slate-700">{d.buyer}</strong></span>
                      <span>{locale === 'fr' ? 'Fournisseur' : 'Supplier'}: <strong className="text-slate-700">{d.supplier}</strong></span>
                      <span>{locale === 'fr' ? 'Soumis le' : 'Raised'}: <strong className="text-slate-700">{d.raised}</strong></span>
                    </div>
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                      ⚠️ {locale === 'fr' ? 'Versement suspendu —' : 'Payment release paused —'} {formatCAD(d.amount)} {locale === 'fr' ? 'retenu en séquestre' : 'held in escrow'}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="btn-ghost border border-slate-200 text-xs py-1.5 px-3">
                      <Eye size={13} /> {locale === 'fr' ? 'Voir la commande' : 'View order'}
                    </button>
                    <button
                      onClick={() => setModal({ type: 'resolve', id: d.id, issue: d.issue, amount: d.amount })}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-success-600 text-white text-xs font-semibold hover:bg-success-700 transition-colors"
                    >
                      <RefreshCw size={13} /> {ta.resolve}
                    </button>
                    <button
                      onClick={() => setModal({ type: 'refund', id: d.id, buyer: d.buyer, amount: d.amount })}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 transition-colors"
                    >
                      <DollarSign size={13} /> {ta.refund}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ledger tab */}
        {tab === 'ledger' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500">{locale === 'fr' ? '10 dernières transactions · Tous les montants en CAD' : 'Last 10 transactions · All amounts in CAD'}</p>
              <button
                onClick={() => { downloadCSV(); addToast('CSV downloaded.', 'success') }}
                className="btn-ghost border border-slate-200 text-xs"
              >
                {ta.exportCSV}
              </button>
            </div>
            <div className="card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">TX ID</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">{locale === 'fr' ? 'Date' : 'Date'}</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">{locale === 'fr' ? 'Type' : 'Type'}</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">{locale === 'fr' ? 'Partie' : 'Party'}</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase">{locale === 'fr' ? 'Montant' : 'Amount'}</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Stripe Ref</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockLedger.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-600">{tx.id}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">{tx.date}</td>
                      <td className="px-5 py-3.5">
                        <span className={ledgerTypeColors[tx.type] || 'badge-gray'}>{tx.type}</span>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell text-xs text-slate-600">{tx.party}</td>
                      <td className={`px-5 py-3.5 text-right font-bold text-sm ${tx.amount < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                        {tx.amount < 0 ? '-' : '+'}{formatCAD(Math.abs(tx.amount))}
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell font-mono text-xs text-slate-400">{tx.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Taxonomy tab */}
        {tab === 'taxonomy' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1">{ta.taxonomyTitle}</h2>
              <p className="text-sm text-slate-500">{ta.taxonomySub}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Categories */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Tag size={16} className="text-brand-500" />
                    {locale === 'fr' ? 'Catégories' : 'Categories'}
                  </h3>
                  <button
                    onClick={() => setModal({ type: 'addCategory' })}
                    className="btn-ghost border border-slate-200 text-xs py-1.5"
                  >
                    <Plus size={13} /> {ta.addCategory}
                  </button>
                </div>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{cat.nameEn}</p>
                        <p className="text-xs text-slate-400 font-mono">ID: {cat.id}</p>
                      </div>
                      <button className="btn-ghost text-xs py-1 px-2 text-red-500 hover:bg-red-50">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SKUs */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Package size={16} className="text-brand-500" />
                    {locale === 'fr' ? 'SKU du catalogue' : 'Catalogue SKUs'}
                  </h3>
                  <button
                    onClick={() => setModal({ type: 'addSku' })}
                    className="btn-ghost border border-slate-200 text-xs py-1.5"
                  >
                    <Plus size={13} /> {ta.addSku}
                  </button>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {MOCK_SKUS.map((sku) => (
                    <div key={sku.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{sku.nameEn}</p>
                        <p className="text-xs text-slate-400 font-mono">SKU: {sku.id} · {sku.unit}</p>
                      </div>
                      <button className="btn-ghost text-xs py-1 px-2 text-red-500 hover:bg-red-50">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
              Approving: <strong>{modal.org}</strong>
            </div>
            <div>
              <label className="label">{ta.approveNote}</label>
              <textarea className="input min-h-24 resize-none" value={approveNote} onChange={e => setApproveNote(e.target.value)} placeholder={locale === 'fr' ? 'Optionnel…' : 'Optional…'} />
            </div>
            <div className="flex gap-3">
              <button onClick={closeModal} className="btn-ghost border border-slate-200 flex-1">{ta.cancelBtn}</button>
              <button onClick={handleApprove} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-success-600 hover:bg-success-700 transition-colors">
                <CheckCircle2 size={16} /> {ta.approve}
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
              <button onClick={handleReject} disabled={!rejectReason.trim()} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <XCircle size={16} /> {ta.reject}
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
                {[
                  { value: 'close', label: ta.interveneClose },
                  { value: 'extend', label: ta.interveneExtend },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setInterveneAction(opt.value as any)}
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

      {modal?.type === 'resolve' && (
        <Modal title={ta.resolveTitle} onClose={closeModal}>
          <div className="space-y-4">
            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">{modal.issue}</p>
            <div>
              <label className="label">{locale === 'fr' ? 'Résolution' : 'Resolution'}</label>
              <div className="space-y-2">
                {[
                  { value: 'supplier', label: ta.resolveSupplier },
                  { value: 'buyer', label: ta.resolveBuyer },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setResolveOutcome(opt.value as any)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left text-sm transition-all ${resolveOutcome === opt.value ? 'border-brand-500 bg-brand-50 text-brand-700 font-semibold' : 'border-slate-200 text-slate-600'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">{ta.resolveNote}</label>
              <textarea className="input min-h-20 resize-none" value={resolveNote} onChange={e => setResolveNote(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <button onClick={closeModal} className="btn-ghost border border-slate-200 flex-1">{ta.cancelBtn}</button>
              <button onClick={handleResolve} className="btn-primary flex-1">{ta.resolve}</button>
            </div>
          </div>
        </Modal>
      )}

      {modal?.type === 'refund' && (
        <Modal title={ta.refundTitle} onClose={closeModal}>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">{locale === 'fr' ? 'Rembourser' : 'Issuing refund to'} <strong>{modal.buyer}</strong>. {locale === 'fr' ? 'Maximum :' : 'Max:'} {formatCAD(modal.amount)}</p>
            <div>
              <label className="label">{ta.refundAmount}</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                <input type="number" className="input pl-8" value={refundAmount} onChange={e => setRefundAmount(e.target.value)} placeholder={modal.amount.toString()} max={modal.amount} min="0" />
              </div>
            </div>
            <div>
              <label className="label">{ta.refundReason}</label>
              <input type="text" className="input" value={refundReason} onChange={e => setRefundReason(e.target.value)} placeholder={locale === 'fr' ? 'Raison…' : 'Reason…'} />
            </div>
            <div className="flex gap-3">
              <button onClick={closeModal} className="btn-ghost border border-slate-200 flex-1">{ta.cancelBtn}</button>
              <button onClick={handleRefund} disabled={!refundAmount} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-amber-500 hover:bg-amber-600 transition-colors disabled:opacity-50">
                <DollarSign size={16} /> {ta.refund}
              </button>
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
              <button onClick={handleConfigSave} disabled={!configValue.trim()} className="btn-primary flex-1">
                <Settings size={16} /> {locale === 'fr' ? 'Enregistrer' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {modal?.type === 'addCategory' && (
        <Modal title={locale === 'fr' ? 'Ajouter une catégorie' : 'Add Category'} onClose={closeModal}>
          <div className="space-y-4">
            <div>
              <label className="label">{locale === 'fr' ? 'Nom de la catégorie (EN)' : 'Category name (EN)'}</label>
              <input type="text" className="input" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="e.g. Healthcare" />
            </div>
            <div className="flex gap-3">
              <button onClick={closeModal} className="btn-ghost border border-slate-200 flex-1">{ta.cancelBtn}</button>
              <button onClick={handleAddCategory} disabled={!newCategoryName.trim()} className="btn-primary flex-1">
                <Plus size={16} /> {locale === 'fr' ? 'Ajouter' : 'Add'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {modal?.type === 'addSku' && (
        <Modal title={locale === 'fr' ? 'Ajouter un SKU' : 'Add SKU'} onClose={closeModal}>
          <div className="space-y-4">
            <div>
              <label className="label">{locale === 'fr' ? 'Nom du produit (EN)' : 'Product name (EN)'}</label>
              <input type="text" className="input" value={newSkuName} onChange={e => setNewSkuName(e.target.value)} placeholder="e.g. Nitrile Gloves (Box of 100)" />
            </div>
            <div className="flex gap-3">
              <button onClick={closeModal} className="btn-ghost border border-slate-200 flex-1">{ta.cancelBtn}</button>
              <button onClick={handleAddSku} disabled={!newSkuName.trim()} className="btn-primary flex-1">
                <Plus size={16} /> {locale === 'fr' ? 'Ajouter' : 'Add'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
