'use client'
import { useState } from 'react'
import Link from 'next/link'
import { type Locale, getTranslation } from '@/lib/i18n'
import Footer from '@/components/Footer'
import {
  ArrowLeft, ArrowRight, Check, Search, Calendar, MapPin,
  Package, ChevronRight, Info, AlertCircle
} from 'lucide-react'
import { MOCK_SKUS, REGIONS, PROVINCES, MOCK_OFFERS, formatCAD, getCurrentTier } from '@/lib/mock-data'

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
          <Link href={`/${locale}/pools`} className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1">
            <ArrowLeft size={14} /> {t.createPool.allPools}
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default function CreatePoolContent({ locale }: { locale: Locale }) {
  const t = getTranslation(locale)
  const [step, setStep] = useState(1)
  const [skuSearch, setSkuSearch] = useState('')
  const [selectedSku, setSelectedSku] = useState<typeof MOCK_SKUS[0] | null>(null)
  const [form, setForm] = useState({
    targetQty: '',
    minQty: '',
    region: '',
    closingDate: '',
    myQty: '',
    myAddress: '',
    myMaxPrice: '',
  })
  const [launched, setLaunched] = useState(false)

  const totalSteps = 4
  const filteredSkus = MOCK_SKUS.filter((s) =>
    !skuSearch || s.nameEn.toLowerCase().includes(skuSearch.toLowerCase())
  )

  const matchingOffer = selectedSku
    ? MOCK_OFFERS.find((o) => o.skuId === selectedSku.id)
    : null

  const estimatedPrice = selectedSku && matchingOffer && form.myQty
    ? getCurrentTier(matchingOffer.tiers, Number(form.myQty)).unitPrice
    : null

  const handleLaunch = () => {
    setLaunched(true)
    setTimeout(() => {
      window.location.href = `/${locale}/pools`
    }, 2000)
  }

  const CATEGORY_EMOJIS: Record<string, string> = {
    auto: '🚗',
    construction: '🏗️',
    restaurant: '🍽️',
    retail: '🏪',
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNavbar locale={locale} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t.createPool.title}</h1>
          <p className="text-slate-500 mt-1">{t.createPool.sub}</p>
        </div>

        {/* Step progress */}
        <div className="mb-8">
          <div className="flex items-center gap-0">
            {[t.createPool.step1, t.createPool.step2, t.createPool.step3, t.createPool.step4].map((label, i) => (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step > i + 1 ? 'bg-success-500 text-white' :
                    step === i + 1 ? 'bg-brand-700 text-white shadow-md' :
                    'bg-white border-2 border-slate-300 text-slate-400'
                  }`}>
                    {step > i + 1 ? <Check size={16} /> : i + 1}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium whitespace-nowrap ${step === i + 1 ? 'text-brand-700' : 'text-slate-400'}`}>
                    {label}
                  </span>
                </div>
                {i < totalSteps - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-5 transition-all ${step > i + 1 ? 'bg-success-400' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {launched ? (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-6">
              <Check className="text-success-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">{t.createPool.launched}</h2>
            <p className="text-slate-500 mb-4">{t.createPool.launchLive}</p>
            <div className="animate-pulse text-brand-600 text-sm">{t.createPool.redirecting}</div>
          </div>
        ) : (
          <div className="card p-8">
            {/* Step 1: Product selection */}
            {step === 1 && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-5">{t.createPool.step1}</h2>

                <div className="relative mb-5">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    className="input pl-10"
                    placeholder={t.createPool.searchSku}
                    value={skuSearch}
                    onChange={(e) => setSkuSearch(e.target.value)}
                  />
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto mb-6">
                  {filteredSkus.map((sku) => (
                    <button
                      key={sku.id}
                      onClick={() => setSelectedSku(sku)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                        selectedSku?.id === sku.id
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl">{CATEGORY_EMOJIS[sku.categoryId] ?? '📦'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm">{sku.nameEn}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{sku.unit} · SKU: {sku.id}</p>
                      </div>
                      {selectedSku?.id === sku.id && (
                        <div className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {selectedSku && matchingOffer && (
                  <div className="bg-success-50 border border-success-200 rounded-xl p-4 mb-6">
                    <p className="text-xs font-semibold text-success-700 mb-2">✓ Supplier offer available</p>
                    <p className="text-sm font-bold text-slate-900">{matchingOffer.supplierName}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {matchingOffer.tiers.map((tier) => (
                        <span key={tier.id} className="badge-green text-xs">
                          {tier.minQty}–{tier.maxQty ?? '∞'}: {formatCAD(tier.unitPrice)}/unit
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => selectedSku && setStep(2)}
                  disabled={!selectedSku}
                  className={`btn-primary w-full text-base py-3.5 ${!selectedSku ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {t.createPool.next} <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* Step 2: Pool settings */}
            {step === 2 && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-1">{t.createPool.step2}</h2>
                <p className="text-sm text-slate-500 mb-5">{t.createPool.step2Desc}</p>

                {selectedSku && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-6 text-sm">
                    <span className="text-2xl">{CATEGORY_EMOJIS[selectedSku.categoryId]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 line-clamp-1">{selectedSku.nameEn}</p>
                    </div>
                    <button onClick={() => setStep(1)} className="text-brand-600 text-xs font-medium hover:underline flex-shrink-0">
                      {t.createPool.changeSku}
                    </button>
                  </div>
                )}

                <div className="space-y-5 mb-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">{t.createPool.targetQty}</label>
                      <input
                        type="number"
                        className="input"
                        placeholder="500"
                        value={form.targetQty}
                        onChange={(e) => setForm({ ...form, targetQty: e.target.value })}
                      />
                      <p className="text-xs text-slate-400 mt-1">{t.createPool.targetQtyHint}</p>
                    </div>
                    <div>
                      <label className="label">{t.createPool.minQty}</label>
                      <input
                        type="number"
                        className="input"
                        placeholder="100"
                        value={form.minQty}
                        onChange={(e) => setForm({ ...form, minQty: e.target.value })}
                      />
                      <p className="text-xs text-slate-400 mt-1">{t.createPool.minQtyHint}</p>
                    </div>
                  </div>

                  <div>
                    <label className="label">{t.createPool.region}</label>
                    <select
                      className="input"
                      value={form.region}
                      onChange={(e) => setForm({ ...form, region: e.target.value })}
                    >
                      <option value="">Select delivery region...</option>
                      {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <p className="text-xs text-slate-400 mt-1">{t.createPool.regionHint}</p>
                  </div>

                  <div>
                    <label className="label">{t.createPool.closingDate}</label>
                    <input
                      type="date"
                      className="input"
                      value={form.closingDate}
                      min={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      onChange={(e) => setForm({ ...form, closingDate: e.target.value })}
                    />
                    <p className="text-xs text-slate-400 mt-1">{t.createPool.closingDateHint}</p>
                  </div>

                  {matchingOffer && (
                    <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <Info size={14} className="text-brand-600" />
                        <p className="text-sm font-semibold text-brand-700">{t.createPool.priceLadder}</p>
                      </div>
                      <div className="space-y-1.5">
                        {matchingOffer.tiers.map((tier) => (
                          <div key={tier.id} className="flex justify-between text-sm">
                            <span className="text-slate-600">{tier.minQty}–{tier.maxQty ?? '∞'} units</span>
                            <span className="font-semibold text-brand-700">{formatCAD(tier.unitPrice)}/unit</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-ghost border border-slate-200">
                    <ArrowLeft size={16} /> {t.createPool.back}
                  </button>
                  <button onClick={() => setStep(3)} className="btn-primary flex-1 text-base py-3">
                    {t.createPool.next} <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: My commitment */}
            {step === 3 && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-1">{t.createPool.step3}</h2>
                <p className="text-sm text-slate-500 mb-5">{t.createPool.step3Desc}</p>

                <div className="space-y-5 mb-8">
                  <div>
                    <label className="label">{t.createPool.myQty}</label>
                    <input
                      type="number"
                      className="input text-lg font-bold"
                      placeholder="e.g. 20"
                      value={form.myQty}
                      onChange={(e) => setForm({ ...form, myQty: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">{t.createPool.myAddress}</label>
                    <select className="input" value={form.myAddress} onChange={(e) => setForm({ ...form, myAddress: e.target.value })}>
                      <option value="">Select address...</option>
                      <option value="1">1234 Rue Principale, Montréal QC H1A 1A1</option>
                      <option value="2">+ Add new address</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">{t.createPool.myMaxPrice}</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                      <input
                        type="number"
                        className="input pl-8"
                        placeholder="Optional"
                        value={form.myMaxPrice}
                        onChange={(e) => setForm({ ...form, myMaxPrice: e.target.value })}
                      />
                    </div>
                  </div>

                  {estimatedPrice && form.myQty && (
                    <div className="bg-success-50 border border-success-200 rounded-xl p-4">
                      <p className="text-sm font-semibold text-success-700 mb-2">Payment authorization (held until pool closes)</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">{form.myQty} × {formatCAD(estimatedPrice)}</span>
                        <span className="font-bold">{formatCAD(Number(form.myQty) * estimatedPrice)}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        This hold is released if the pool fails or if your max price is exceeded. Price can only drop.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-ghost border border-slate-200">
                    <ArrowLeft size={16} /> {t.createPool.back}
                  </button>
                  <button onClick={() => setStep(4)} className="btn-primary flex-1 text-base py-3">
                    {t.createPool.next} <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-1">{t.createPool.step4}</h2>
                <p className="text-sm text-slate-500 mb-5">{t.createPool.step4Desc}</p>

                <div className="bg-slate-50 rounded-2xl p-5 mb-6 space-y-3">
                  {[
                    { label: t.createPool.review.product, value: selectedSku?.nameEn ?? '—' },
                    { label: t.createPool.review.target, value: `${form.targetQty} units` },
                    { label: t.createPool.review.minimum, value: `${form.minQty} units` },
                    { label: t.createPool.review.region, value: form.region || '—' },
                    { label: t.createPool.review.closes, value: form.closingDate || '—' },
                    { label: t.createPool.review.yourQty, value: `${form.myQty} units` },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-sm py-1 border-b border-slate-200 last:border-0">
                      <span className="text-slate-500">{row.label}</span>
                      <span className="font-semibold text-slate-900">{row.value}</span>
                    </div>
                  ))}
                  {estimatedPrice && (
                    <>
                      <div className="flex justify-between text-sm py-1 border-b border-slate-200">
                        <span className="text-slate-500">{t.createPool.review.estimatedPrice}</span>
                        <span className="font-bold text-success-700">{formatCAD(estimatedPrice)}/unit</span>
                      </div>
                      <div className="flex justify-between text-sm py-1">
                        <span className="text-slate-500">{t.createPool.review.estimatedTotal}</span>
                        <span className="font-bold text-brand-700">{formatCAD(Number(form.myQty) * estimatedPrice)}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
                  <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    {t.createPool.paymentNote}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(3)} className="btn-ghost border border-slate-200">
                    <ArrowLeft size={16} /> {t.createPool.back}
                  </button>
                  <button onClick={handleLaunch} className="btn-accent flex-1 text-base py-3">
                    🚀 {t.createPool.launchBtn}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer locale={locale} />
    </div>
  )
}
