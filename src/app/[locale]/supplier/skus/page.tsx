'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { type Locale } from '@/lib/i18n'
import { Plus, Loader2, Package, CheckCircle2 } from 'lucide-react'

const CATEGORIES = [
  { en: 'Tires', fr: 'Pneus' },
  { en: 'Auto Parts', fr: 'Pièces auto' },
  { en: 'Shop Supplies', fr: 'Fournitures atelier' },
  { en: 'PPE', fr: 'EPI' },
  { en: 'Lubricants', fr: 'Lubrifiants' },
  { en: 'Construction', fr: 'Construction' },
  { en: 'Food Service', fr: 'Restauration' },
  { en: 'Cleaning', fr: 'Nettoyage' },
  { en: 'Other', fr: 'Autre' },
]

interface SKU {
  id: string
  nameEn: string
  nameFr: string
  category: string
  unit: string
  soloPrice: number
  minOrderQty: number
  active: boolean
}

export default function SupplierSKUsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const fr = locale === 'fr'

  const [skus, setSkus] = useState<SKU[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    nameEn: '', nameFr: '', descEn: '', descFr: '',
    category: 'Other', unit: 'unit',
    soloPrice: '', minOrderQty: '1',
  })

  useEffect(() => {
    fetch('/api/suppliers/skus')
      .then(r => r.json())
      .then(d => { setSkus(d.skus ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/suppliers/skus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, soloPrice: parseFloat(form.soloPrice), minOrderQty: parseInt(form.minOrderQty) }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? (fr ? 'Erreur.' : 'Error.')); setSaving(false); return }
      setSkus(prev => [data.sku, ...prev])
      setForm({ nameEn: '', nameFr: '', descEn: '', descFr: '', category: 'Other', unit: 'unit', soloPrice: '', minOrderQty: '1' })
      setShowForm(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError(fr ? 'Erreur réseau.' : 'Network error.')
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center">
                <span className="text-white font-black text-lg leading-none">t</span>
              </div>
              <span className="text-xl font-black tracking-tight text-brand-800">taddam</span>
            </Link>
            <Link href={`/${locale}/supplier`} className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              {fr ? '← Portail fournisseur' : '← Supplier portal'}
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{fr ? 'Votre catalogue de produits' : 'Your product catalog'}</h1>
            <p className="text-slate-500 mt-1">{fr ? 'Gérez vos produits et leur tarification' : 'Manage your products and pricing'}</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
            <Plus size={15} /> {fr ? 'Ajouter un produit' : 'Add product'}
          </button>
        </div>

        {saved && (
          <div className="mb-6 flex items-center gap-2 p-3 bg-success-50 border border-success-200 rounded-xl text-sm text-success-700">
            <CheckCircle2 size={16} /> {fr ? 'Produit enregistré!' : 'Product saved!'}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-5">{fr ? 'Nouveau produit' : 'New product'}</h2>
            {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">{error}</div>}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">{fr ? 'Nom du produit (anglais)' : 'Product name (English)'} <span className="text-red-500">*</span></label>
                  <input type="text" className="input" value={form.nameEn} onChange={e => setForm({ ...form, nameEn: e.target.value })} required />
                </div>
                <div>
                  <label className="label">{fr ? 'Nom du produit (français)' : 'Product name (French)'} <span className="text-red-500">*</span></label>
                  <input type="text" className="input" value={form.nameFr} onChange={e => setForm({ ...form, nameFr: e.target.value })} required />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">{fr ? 'Description (anglais)' : 'Description (English)'}</label>
                  <textarea className="input resize-none min-h-16" value={form.descEn} onChange={e => setForm({ ...form, descEn: e.target.value })} />
                </div>
                <div>
                  <label className="label">{fr ? 'Description (français)' : 'Description (French)'}</label>
                  <textarea className="input resize-none min-h-16" value={form.descFr} onChange={e => setForm({ ...form, descFr: e.target.value })} />
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="label">{fr ? 'Catégorie' : 'Category'}</label>
                  <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c.en} value={c.en}>{fr ? c.fr : c.en}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">{fr ? 'Unité de mesure' : 'Unit of measure'}</label>
                  <input type="text" className="input" placeholder="unit / case / pair…" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} />
                </div>
                <div>
                  <label className="label">{fr ? 'Qté min. de commande' : 'Min. order qty'}</label>
                  <input type="number" className="input" min="1" value={form.minOrderQty} onChange={e => setForm({ ...form, minOrderQty: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="label">{fr ? 'Prix de détail solo (CAD)' : 'Solo retail price (CAD)'} <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input type="number" step="0.01" min="0" className="input pl-8" placeholder="0.00" value={form.soloPrice} onChange={e => setForm({ ...form, soloPrice: e.target.value })} required />
                </div>
                <p className="text-xs text-slate-400 mt-1">{fr ? 'Prix individuel sans groupe (utilisé pour calculer les économies)' : 'Individual price without pool (used to calculate savings)'}</p>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost border border-slate-200">{fr ? 'Annuler' : 'Cancel'}</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? <><Loader2 size={16} className="animate-spin" /></> : <>{fr ? 'Enregistrer le produit' : 'Save product'}</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-brand-600" /></div>
        ) : skus.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">{fr ? 'Aucun produit encore' : 'No products yet'}</h3>
            <p className="text-sm text-slate-500 mb-6">{fr ? 'Ajoutez votre premier produit pour commencer à créer des groupes.' : 'Add your first product to start creating pools.'}</p>
            <button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={16} /> {fr ? 'Ajouter un produit' : 'Add product'}</button>
          </div>
        ) : (
          <div className="space-y-4">
            {skus.map(sku => (
              <div key={sku.id} className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">{fr ? sku.nameFr : sku.nameEn}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{fr ? sku.nameFr !== sku.nameEn ? sku.nameEn : '' : sku.nameFr}</p>
                    <div className="flex gap-3 mt-2 text-xs text-slate-500">
                      <span className="badge-blue">{sku.category}</span>
                      <span>{sku.unit}</span>
                      <span>{fr ? 'Min :' : 'Min:'} {sku.minOrderQty}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-slate-900">${sku.soloPrice.toFixed(2)}</p>
                    <p className="text-xs text-slate-400">{fr ? 'prix solo' : 'solo price'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
