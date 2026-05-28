'use client'
import { useState } from 'react'
import Link from 'next/link'
import { type Locale, getTranslation } from '@/lib/i18n'
import Footer from '@/components/Footer'
import Modal from '@/components/Modal'
import { useToast } from '@/components/Toast'
import UserMenu from '@/components/UserMenu'
import {
  Package, DollarSign, Star, Plus, Edit2, Pause,
  Play, ChevronRight, Truck, Users, Check
} from 'lucide-react'
import { MOCK_SUPPLIER_OFFERS, MOCK_POOLS, REGIONS, MOCK_SKUS, formatCAD, getCurrentTier } from '@/lib/mock-data'

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
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:block">CanSafe Supply Co. · {locale === 'fr' ? 'Fournisseur' : 'Supplier'}</span>
            <UserMenu locale={locale} fallbackInitials="CS" />
          </div>
        </div>
      </div>
    </nav>
  )
}

type ModalType =
  | { type: 'addOffer' }
  | { type: 'editOffer'; offer: typeof MOCK_SUPPLIER_OFFERS[0] }
  | { type: 'updateShipment'; orderId: string; buyer: string; currentStatus: string }
  | null

interface OfferRow {
  id: string
  sku: string
  category: string
  regions: string[]
  capacity: number
  validTo: string
  tiers: { range: string; price: number }[]
  activePools: number
  status: 'active' | 'paused'
}

const initialOffers: OfferRow[] = MOCK_SUPPLIER_OFFERS.map(o => ({ ...o, status: 'active' as const }))

const mockOrders = [
  { id: 'ORD-001', buyer: 'Kowalski Construction', qty: 200, value: 780, status: 'pending', product: 'Level 5 Gloves', tracking: '' },
  { id: 'ORD-002', buyer: 'BuildRight Supplies', qty: 150, value: 585, status: 'in_transit', product: 'Level 5 Gloves', tracking: 'CP123456789CA' },
  { id: 'ORD-003', buyer: 'Ontario Safety Co.', qty: 75, value: 292, status: 'delivered', product: 'Level 5 Gloves', tracking: 'CP987654321CA' },
  { id: 'ORD-004', buyer: 'Prairie Contractors', qty: 300, value: 1170, status: 'pending', product: 'Level 5 Gloves', tracking: '' },
]

const mockPayouts = [
  { id: 'PAY-001', date: '2025-05-15', pool: 'PPE Pool — Ontario', amount: 4680, status: 'settled' },
  { id: 'PAY-002', date: '2025-05-08', pool: 'Cleaning Pool — National', amount: 8240, status: 'settled' },
  { id: 'PAY-003', date: '2025-04-29', pool: 'Restaurant Supply Pool — QC', amount: 3120, status: 'settled' },
]

export default function SupplierPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const t = getTranslation(locale)
  const ts = t.supplier
  const { addToast } = useToast()

  const [tab, setTab] = useState<'offers' | 'pools' | 'orders' | 'payouts'>('offers')
  const [modal, setModal] = useState<ModalType>(null)
  const [offers, setOffers] = useState<OfferRow[]>(initialOffers)
  const [orders, setOrders] = useState(mockOrders)

  // Add offer form state
  const [newOfferSku, setNewOfferSku] = useState('')
  const [newOfferRegions, setNewOfferRegions] = useState('')
  const [newOfferCapacity, setNewOfferCapacity] = useState('')
  const [newOfferValidTo, setNewOfferValidTo] = useState('')

  // Update shipment state
  const [trackingNum, setTrackingNum] = useState('')
  const [newShipStatus, setNewShipStatus] = useState('in_transit')

  const tabs = [
    { id: 'offers', label: ts.offersTab },
    { id: 'pools', label: ts.poolsTab },
    { id: 'orders', label: ts.ordersTab },
    { id: 'payouts', label: ts.payoutsTab },
  ] as const

  const eligiblePools = MOCK_POOLS.slice(1, 4)

  const closeModal = () => {
    setModal(null)
    setNewOfferSku('')
    setNewOfferRegions('')
    setNewOfferCapacity('')
    setNewOfferValidTo('')
    setTrackingNum('')
    setNewShipStatus('in_transit')
  }

  const handleTogglePause = (id: string) => {
    setOffers(prev => prev.map(o => {
      if (o.id !== id) return o
      const newStatus = o.status === 'active' ? 'paused' : 'active'
      addToast(newStatus === 'active' ? ts.offerResumed : ts.offerPaused, 'info')
      return { ...o, status: newStatus }
    }))
  }

  const handleAddOffer = () => {
    if (!newOfferSku || !newOfferCapacity) return
    const sku = MOCK_SKUS.find(s => s.id === newOfferSku)
    const newOffer: OfferRow = {
      id: `offer-new-${Date.now()}`,
      sku: sku?.nameEn ?? newOfferSku,
      category: sku?.categoryId ?? 'general',
      regions: newOfferRegions.split(',').map(r => r.trim()).filter(Boolean),
      capacity: Number(newOfferCapacity),
      validTo: newOfferValidTo || '2025-12-31',
      tiers: [{ range: '1–∞', price: 0 }],
      activePools: 0,
      status: 'active',
    }
    setOffers(prev => [newOffer, ...prev])
    closeModal()
    addToast(ts.offerSaved, 'success')
  }

  const handleUpdateShipment = () => {
    if (modal?.type !== 'updateShipment') return
    setOrders(prev => prev.map(o =>
      o.id === modal.orderId
        ? { ...o, status: newShipStatus, tracking: trackingNum || o.tracking }
        : o
    ))
    closeModal()
    addToast(ts.shipUpdated, 'success')
  }

  const getStatusBadge = (status: string) => {
    const labels: Record<string, string> = {
      delivered: t.dashboard.status.delivered,
      in_transit: t.dashboard.status.in_transit,
      pending: t.dashboard.status.pending,
    }
    const cls: Record<string, string> = {
      delivered: 'badge-green',
      in_transit: 'badge-orange',
      pending: 'badge-gray',
    }
    return <span className={cls[status] ?? 'badge-gray'}>{labels[status] ?? status}</span>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNavbar locale={locale} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{ts.title}</h1>
                <span className="badge-green">✓ {locale === 'fr' ? 'Vérifié' : 'Verified'}</span>
              </div>
              <p className="text-slate-500">{ts.sub}</p>
            </div>
            <button onClick={() => setModal({ type: 'addOffer' })} className="btn-primary text-sm">
              <Plus size={15} /> {ts.addOffer}
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Package, value: offers.filter(o => o.status === 'active').length.toString(), label: ts.activeOffers, color: 'text-brand-600', bg: 'bg-brand-50', change: locale === 'fr' ? '1 expire bientôt' : '1 expiring soon' },
            { icon: Truck, value: orders.filter(o => o.status === 'pending' || o.status === 'in_transit').length.toString(), label: ts.pendingOrders, color: 'text-accent-600', bg: 'bg-accent-50', change: locale === 'fr' ? '2 à expédier cette semaine' : '2 to ship this week' },
            { icon: DollarSign, value: '$16,040', label: ts.monthlyRevenue, color: 'text-success-600', bg: 'bg-success-50', change: '+22% vs last month' },
            { icon: Star, value: '4.6', label: ts.rating, color: 'text-amber-600', bg: 'bg-amber-50', change: 'Based on 48 reviews' },
          ].map((s) => (
            <div key={s.label} className="card p-5">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={s.color} size={20} />
              </div>
              <div className="text-2xl font-black text-slate-900 mb-0.5">{s.value}</div>
              <div className="text-xs font-semibold text-slate-700 mb-1">{s.label}</div>
              <div className="text-xs text-slate-400">{s.change}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6 gap-1">
          {tabs.map((t2) => (
            <button
              key={t2.id}
              onClick={() => setTab(t2.id)}
              className={`px-5 py-3 text-sm font-semibold rounded-t-lg transition-all border-b-2 -mb-px ${
                tab === t2.id
                  ? 'text-brand-700 border-brand-700 bg-brand-50'
                  : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >
              {t2.label}
            </button>
          ))}
        </div>

        {/* Offers tab */}
        {tab === 'offers' && (
          <div className="space-y-4">
            {offers.map((offer) => (
              <div key={offer.id} className="card p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900">{offer.sku}</h3>
                      <span className={offer.status === 'active' ? 'badge-green' : 'badge-gray'}>
                        {offer.status === 'active' ? ts.offerStatus.active : ts.offerStatus.paused}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{offer.category} · {locale === 'fr' ? 'Régions' : 'Regions'}: {offer.regions.join(', ')}</p>
                    <p className="text-xs text-slate-400 mt-1">{locale === 'fr' ? 'Capacité' : 'Capacity'}: {offer.capacity} {locale === 'fr' ? 'unités' : 'units'} · {locale === 'fr' ? 'Valide jusqu\'au' : 'Valid to'}: {offer.validTo}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => setModal({ type: 'editOffer', offer })}
                      className="btn-ghost border border-slate-200 text-xs py-1.5 px-3"
                    >
                      <Edit2 size={13} /> {ts.editOffer}
                    </button>
                    <button
                      onClick={() => handleTogglePause(offer.id)}
                      className="btn-ghost border border-slate-200 text-xs py-1.5 px-3"
                    >
                      {offer.status === 'active' ? <Pause size={13} /> : <Play size={13} />}
                      {offer.status === 'active' ? ts.pauseOffer : ts.resumeOffer}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  {offer.tiers.map((tier) => (
                    <div key={tier.range} className="bg-slate-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-slate-500 mb-1">{tier.range} {locale === 'fr' ? 'unités' : 'units'}</p>
                      <p className="font-bold text-brand-700">{tier.price > 0 ? formatCAD(tier.price) : '—'}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Users size={13} className="text-brand-500" />
                    {offer.activePools} {locale === 'fr' ? 'correspondances de groupes actifs' : 'active pool matches'}
                  </span>
                  {offer.activePools > 0 && (
                    <button
                      onClick={() => setTab('pools')}
                      className="text-brand-600 font-medium flex items-center gap-1 text-xs hover:underline"
                    >
                      {locale === 'fr' ? 'Voir les groupes' : 'View pools'} <ChevronRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={() => setModal({ type: 'addOffer' })}
              className="w-full p-5 rounded-2xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-brand-400 hover:text-brand-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Plus size={18} /> {ts.addOffer}
            </button>
          </div>
        )}

        {/* Pools tab */}
        {tab === 'pools' && (
          <div>
            <div className="mb-6">
              <h3 className="font-bold text-slate-900 mb-1">{ts.eligiblePools}</h3>
              <p className="text-sm text-slate-500">{locale === 'fr' ? 'Vos offres sont éligibles pour ces groupes ouverts.' : 'Your offers qualify for these open demand pools.'}</p>
            </div>
            <div className="space-y-4">
              {eligiblePools.map((pool) => {
                const tier = getCurrentTier(pool.offer.tiers, pool.committedQty)
                const pct = Math.round((pool.committedQty / pool.targetQty) * 100)
                return (
                  <div key={pool.id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">
                      {pool.imageEmoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-900 text-sm">{pool.skuName}</h4>
                        <span className="badge-blue text-xs">{pool.region}</span>
                      </div>
                      <p className="text-xs text-slate-500">{pool.committedQty} / {pool.targetQty} {locale === 'fr' ? 'unités' : 'units'} · {pct}% {locale === 'fr' ? 'de l\'objectif' : 'of target'}</p>
                      <div className="progress-bar h-1.5 mt-2 w-48">
                        <div className="progress-fill pool-progress-mid" style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-slate-900">{pool.committedQty} {locale === 'fr' ? 'unités requises' : 'units needed'}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{locale === 'fr' ? 'Votre capacité :' : 'Your capacity:'} {pool.offer.capacity}</p>
                      <Link href={`/${locale}/pools/${pool.id}`} className="text-brand-600 text-xs font-medium hover:underline flex items-center gap-1 mt-1 justify-end">
                        {ts.manifest} <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Orders tab */}
        {tab === 'orders' && (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">{locale === 'fr' ? 'Commande' : 'Order'}</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">{locale === 'fr' ? 'Acheteur' : 'Buyer'}</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">{locale === 'fr' ? 'Qté' : 'Qty'}</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">{locale === 'fr' ? 'Valeur' : 'Value'}</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">{locale === 'fr' ? 'Statut' : 'Status'}</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-xs font-mono font-semibold">{order.id}</p>
                      <p className="text-xs text-slate-400">{order.product}</p>
                      {order.tracking && (
                        <p className="text-xs font-mono text-brand-600 mt-0.5">{order.tracking}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell text-sm text-slate-700">{order.buyer}</td>
                    <td className="px-5 py-4 text-sm font-semibold">{order.qty}</td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-900">{formatCAD(order.value)}</td>
                    <td className="px-5 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-5 py-4">
                      {order.status !== 'delivered' && (
                        <button
                          onClick={() => { setTrackingNum(order.tracking); setNewShipStatus(order.status === 'pending' ? 'in_transit' : 'delivered'); setModal({ type: 'updateShipment', orderId: order.id, buyer: order.buyer, currentStatus: order.status }) }}
                          className="text-brand-600 text-xs font-medium hover:underline whitespace-nowrap"
                        >
                          {ts.updateShipment}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Payouts tab */}
        {tab === 'payouts' && (
          <div>
            <div className="card-elevated p-6 bg-gradient-to-br from-success-50 to-emerald-50 border-success-200 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">{ts.pendingPayout}</h3>
                <span className="badge-green">{ts.payoutNext}</span>
              </div>
              <div className="text-4xl font-black text-success-700 mb-1">{formatCAD(6840)}</div>
              <p className="text-sm text-slate-500">{ts.payoutNote}</p>
            </div>

            <div className="card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Payout ID</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">{ts.payoutPool}</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">{ts.payoutDate}</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">{ts.payoutAmount}</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">{ts.payoutStatus}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockPayouts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 text-xs font-mono font-semibold">{p.id}</td>
                      <td className="px-5 py-4 hidden sm:table-cell text-sm text-slate-700">{p.pool}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{p.date}</td>
                      <td className="px-5 py-4 text-sm font-bold text-success-700">{formatCAD(p.amount)}</td>
                      <td className="px-5 py-4"><span className="badge-green">{ts.payoutSettled}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Footer locale={locale} />

      {/* Add Offer Modal */}
      {modal?.type === 'addOffer' && (
        <Modal title={ts.addOfferTitle} onClose={closeModal} size="md">
          <div className="space-y-4">
            <div>
              <label className="label">{ts.offerSkuLabel}</label>
              <select className="input" value={newOfferSku} onChange={e => setNewOfferSku(e.target.value)}>
                <option value="">{locale === 'fr' ? 'Sélectionner un produit…' : 'Select a product…'}</option>
                {MOCK_SKUS.map(s => (
                  <option key={s.id} value={s.id}>{s.nameEn}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">{ts.offerRegions}</label>
              <input type="text" className="input" value={newOfferRegions} onChange={e => setNewOfferRegions(e.target.value)} placeholder="Quebec, Ontario, National" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">{ts.offerCapacity}</label>
                <input type="number" className="input" value={newOfferCapacity} onChange={e => setNewOfferCapacity(e.target.value)} placeholder="5000" />
              </div>
              <div>
                <label className="label">{ts.offerValidTo}</label>
                <input type="date" className="input" value={newOfferValidTo} onChange={e => setNewOfferValidTo(e.target.value)} />
              </div>
            </div>
            <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl text-xs text-brand-700">
              {locale === 'fr' ? 'Après la soumission, notre équipe examinera votre offre et configurera le barème de prix avec vous.' : 'After submission, our team will review your offer and set up the price ladder with you.'}
            </div>
            <div className="flex gap-3">
              <button onClick={closeModal} className="btn-ghost border border-slate-200 flex-1">{ts.cancelBtn}</button>
              <button onClick={handleAddOffer} disabled={!newOfferSku || !newOfferCapacity} className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
                <Check size={16} /> {ts.saveOffer}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Offer Modal */}
      {modal?.type === 'editOffer' && (
        <Modal title={ts.editOfferTitle} onClose={closeModal} size="md">
          <div className="space-y-4">
            <div>
              <label className="label">{ts.offerSkuLabel}</label>
              <input type="text" className="input bg-slate-50" value={modal.offer.sku} readOnly />
            </div>
            <div>
              <label className="label">{ts.offerRegions}</label>
              <input type="text" className="input" defaultValue={modal.offer.regions.join(', ')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">{ts.offerCapacity}</label>
                <input type="number" className="input" defaultValue={modal.offer.capacity} />
              </div>
              <div>
                <label className="label">{ts.offerValidTo}</label>
                <input type="date" className="input" defaultValue={modal.offer.validTo} />
              </div>
            </div>
            <div>
              <label className="label">{locale === 'fr' ? 'Barème de prix' : 'Price tiers'}</label>
              <div className="space-y-2">
                {modal.offer.tiers.map((tier) => (
                  <div key={tier.range} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl text-sm">
                    <span className="text-slate-500 w-24">{tier.range}</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                      <input type="number" className="input pl-7 py-2 text-sm" defaultValue={tier.price.toFixed(2)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={closeModal} className="btn-ghost border border-slate-200 flex-1">{ts.cancelBtn}</button>
              <button onClick={() => { closeModal(); addToast(ts.offerSaved, 'success') }} className="btn-primary flex-1">
                <Check size={16} /> {ts.saveOffer}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Update Shipment Modal */}
      {modal?.type === 'updateShipment' && (
        <Modal title={ts.updateShipTitle} onClose={closeModal}>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              {locale === 'fr' ? 'Mettre à jour la commande pour' : 'Updating order for'} <strong>{modal.buyer}</strong>
            </p>
            <div>
              <label className="label">{ts.statusLabel}</label>
              <select className="input" value={newShipStatus} onChange={e => setNewShipStatus(e.target.value)}>
                <option value="pending">{t.dashboard.status.pending}</option>
                <option value="in_transit">{t.dashboard.status.in_transit}</option>
                <option value="delivered">{t.dashboard.status.delivered}</option>
              </select>
            </div>
            <div>
              <label className="label">{ts.trackingLabel} ({locale === 'fr' ? 'facultatif' : 'optional'})</label>
              <input type="text" className="input font-mono" value={trackingNum} onChange={e => setTrackingNum(e.target.value)} placeholder="CP123456789CA" />
            </div>
            <div className="flex gap-3">
              <button onClick={closeModal} className="btn-ghost border border-slate-200 flex-1">{ts.cancelBtn}</button>
              <button onClick={handleUpdateShipment} className="btn-primary flex-1">
                <Truck size={16} /> {locale === 'fr' ? 'Mettre à jour' : 'Update'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
