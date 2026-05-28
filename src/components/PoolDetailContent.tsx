'use client'
import { useState } from 'react'
import Link from 'next/link'
import { type Locale, getTranslation } from '@/lib/i18n'
import Footer from '@/components/Footer'
import {
  ArrowLeft, Users, Clock, TrendingDown, Shield, ChevronRight,
  Share2, Copy, Check, MapPin, Calendar, Building2, Star, Plus, Minus
} from 'lucide-react'
import { type Pool, formatCAD, getCurrentTier, getNextTier, getSavingsPct, formatTimeLeft } from '@/lib/mock-data'

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
            <Link href={`/${locale}/pools`} className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1">
              <ArrowLeft size={14} /> {getTranslation(locale).poolDetail.back}
            </Link>
            <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">MT</div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function PoolDetailContent({ locale, pool }: { locale: Locale; pool: Pool }) {
  const t = getTranslation(locale)
  const [qty, setQty] = useState(10)
  const [address, setAddress] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [copied, setCopied] = useState(false)
  const [joined, setJoined] = useState(false)

  const tier = getCurrentTier(pool.offer.tiers, pool.committedQty)
  const nextTier = getNextTier(pool.offer.tiers, pool.committedQty)
  const pct = Math.round((pool.committedQty / pool.targetQty) * 100)
  const savings = getSavingsPct(pool.soloPrice, tier.unitPrice)
  const time = formatTimeLeft(pool.closesAt)
  const estimatedTotal = qty * tier.unitPrice
  const progressColor = pct >= 80 ? 'pool-progress-high' : pct >= 50 ? 'pool-progress-mid' : 'pool-progress-low'

  const mockParticipants = [
    { name: 'Garage Beauchamp', qty: 20, province: 'QC' },
    { name: 'Auto Centre Rioux', qty: 15, province: 'QC' },
    { name: 'Mécanique Leblanc', qty: 30, province: 'QC' },
    { name: 'Anonymous SME', qty: 8, province: 'QC' },
    { name: 'Station Service Laval', qty: 12, province: 'QC' },
  ]

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleJoin = () => {
    setJoined(true)
    setTimeout(() => {
      window.location.href = `/${locale}/dashboard`
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNavbar locale={locale} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href={`/${locale}/pools`} className="hover:text-brand-600 flex items-center gap-1">
            <ArrowLeft size={14} /> {t.poolDetail.back}
          </Link>
          <ChevronRight size={14} />
          <span className="text-slate-700 font-medium line-clamp-1">{pool.skuName}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: pool details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product header card */}
            <div className="card p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-4xl flex-shrink-0">
                  {pool.imageEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="badge-blue">{pool.skuCategory}</span>
                    <span className="badge-green">OPEN</span>
                  </div>
                  <h1 className="text-xl font-bold text-slate-900 leading-tight">{pool.skuName}</h1>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Building2 size={13} /> {pool.creatorOrg}</span>
                    <span className="flex items-center gap-1"><MapPin size={13} /> {pool.region}</span>
                    <span className="flex items-center gap-1"><Calendar size={13} /> Closes in {time.days}d {time.hours}h</span>
                  </div>
                </div>
              </div>

              {/* Big price display */}
              <div className="bg-gradient-to-r from-success-50 to-emerald-50 rounded-2xl p-6 mb-6 border border-success-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{t.poolDetail.priceNow}</p>
                    <div className="text-5xl font-black text-success-700 price-display">{formatCAD(tier.unitPrice)}</div>
                    <p className="text-sm text-slate-500 mt-1">{t.poolDetail.perUnit}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-3xl font-black text-success-600">-{savings}%</div>
                    <p className="text-sm text-slate-500">{t.poolDetail.savings}</p>
                    <p className="text-xs text-slate-400 mt-1">vs. solo at {formatCAD(pool.soloPrice)}</p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-slate-700">
                    <span className="text-xl font-black text-slate-900">{pool.committedQty}</span> {t.poolDetail.committed}
                  </span>
                  <span className="text-slate-500">{t.poolDetail.target}: {pool.targetQty}</span>
                </div>
                <div className="progress-bar h-4">
                  <div className={`progress-fill ${progressColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                  <span>{t.poolDetail.minimum}: {pool.minimumQty}</span>
                  <span>{pct}% of target</span>
                </div>
                {nextTier && (
                  <div className="mt-3 p-3 bg-brand-50 rounded-xl border border-brand-200">
                    <p className="text-sm font-semibold text-brand-700">
                      🎯 {t.poolDetail.nextTierIn} {nextTier.minQty} units
                      ({nextTier.minQty - pool.committedQty} more needed) → <strong>{formatCAD(nextTier.unitPrice)}/unit</strong>
                    </p>
                  </div>
                )}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: t.poolDetail.participants, value: pool.participantCount.toString(), icon: Users },
                  { label: t.poolDetail.poolDeadline, value: `${time.days}d ${time.hours}h`, icon: Clock },
                  { label: locale === 'fr' ? 'Note fournisseur' : 'Supplier rating', value: `${pool.offer.supplierRating}★`, icon: Star },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-3 bg-slate-50 rounded-xl">
                    <stat.icon size={18} className="mx-auto text-slate-400 mb-1" />
                    <div className="font-bold text-slate-900 text-sm">{stat.value}</div>
                    <div className="text-xs text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price tiers */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-900 mb-4">{t.poolDetail.tiersTitle}</h3>
              <div className="space-y-2.5">
                {pool.offer.tiers.map((t2, i) => {
                  const isCurrent = i === pool.offer.tiers.indexOf(tier)
                  const isNext = nextTier && t2.id === nextTier.id
                  const savPct = getSavingsPct(pool.soloPrice, t2.unitPrice)

                  return (
                    <div
                      key={t2.id}
                      className={`tier-row ${isCurrent ? 'tier-active' : isNext ? 'tier-next' : pool.committedQty > (t2.maxQty ?? 0) ? 'opacity-60' : 'tier-inactive opacity-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isCurrent ? 'bg-success-500 text-white' : isNext ? 'bg-brand-200 text-brand-700' : 'bg-slate-200 text-slate-500'}`}>
                          {isCurrent ? '✓' : i + 1}
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">{t2.minQty} – {t2.maxQty ?? '∞'} units</p>
                          <p className={`font-bold ${isCurrent ? 'text-success-700' : 'text-slate-700'}`}>{formatCAD(t2.unitPrice)} / unit</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-bold ${isCurrent ? 'text-success-600' : 'text-slate-500'}`}>-{savPct}%</span>
                        {isCurrent && <p className="text-xs text-success-500 font-semibold">Current</p>}
                        {isNext && <p className="text-xs text-brand-600 font-semibold">Next</p>}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-500 leading-relaxed">
                <strong>Delivery:</strong> {pool.offer.deliveryTerms}
              </div>
            </div>

            {/* Participants */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-900 mb-4">{t.poolDetail.participantList}</h3>
              <div className="space-y-2">
                {mockParticipants.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{i > 0 ? t.poolDetail.anonymous : p.name}</p>
                        <p className="text-xs text-slate-400">{p.province}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{p.qty} units</span>
                  </div>
                ))}
                <p className="text-xs text-slate-400 text-center pt-2">
                  + {pool.participantCount - mockParticipants.length} {t.poolDetail.moreParticipants}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-900 mb-5">{t.poolDetail.timeline}</h3>
              <div className="relative pl-6">
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-200" />
                {[
                  {
                    label: t.poolDetail.created,
                    date: new Date(pool.createdAt).toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA', { year: 'numeric', month: 'short', day: 'numeric' }),
                    done: true,
                  },
                  {
                    label: t.poolDetail.minThreshold,
                    date: `${pool.minimumQty} ${locale === 'fr' ? 'unités requises' : 'units required'}`,
                    done: pool.committedQty >= pool.minimumQty,
                  },
                  {
                    label: t.poolDetail.closes,
                    date: new Date(pool.closesAt).toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA', { year: 'numeric', month: 'short', day: 'numeric' }),
                    done: false,
                  },
                  {
                    label: t.poolDetail.deliveryLabel,
                    date: t.poolDetail.deliveryEstimate,
                    done: false,
                  },
                ].map((step, i) => (
                  <div key={i} className="relative mb-4 last:mb-0">
                    <div className={`absolute -left-5 w-3 h-3 rounded-full border-2 ${step.done ? 'bg-success-500 border-success-500' : 'bg-white border-slate-300'}`} />
                    <p className={`text-sm font-semibold ${step.done ? 'text-slate-900' : 'text-slate-500'}`}>{step.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{step.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="card p-6 bg-gradient-to-br from-brand-50 to-blue-50 border-brand-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center flex-shrink-0">
                  <Share2 className="text-white" size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 mb-1">{t.poolDetail.shareTitle}</h4>
                  <p className="text-sm text-slate-600 mb-4">{t.poolDetail.shareDesc}</p>
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${copied ? 'bg-success-600 text-white' : 'bg-brand-600 text-white hover:bg-brand-700'}`}
                  >
                    {copied ? <Check size={15} /> : <Copy size={15} />}
                    {copied ? t.poolDetail.copied : t.poolDetail.copyLink}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: join panel */}
          <div className="space-y-4">
            <div className="card-elevated p-6 sticky top-24">
              {!joined ? (
                <>
                  <h3 className="font-bold text-slate-900 mb-5 text-lg">{t.poolDetail.joinTitle}</h3>

                  <div className="mb-4">
                    <label className="label">{t.poolDetail.yourQty}</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 5))}
                        className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        className="input text-center font-bold text-lg flex-1"
                        value={qty}
                        min={1}
                        onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                      />
                      <button
                        onClick={() => setQty(qty + 5)}
                        className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="label">{t.poolDetail.yourAddress}</label>
                    <select className="input text-sm" value={address} onChange={(e) => setAddress(e.target.value)}>
                      <option value="">Select ship-to address...</option>
                      <option value="1">1234 Rue Principale, Montréal QC H1A 1A1</option>
                      <option value="2">+ Add new address</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="label">{t.poolDetail.maxPrice}</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">$</span>
                      <input
                        type="number"
                        className="input pl-8 text-sm"
                        placeholder="e.g. 110"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{t.poolDetail.maxPriceHint}</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 mb-5 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{qty} × {formatCAD(tier.unitPrice)}</span>
                      <span className="font-semibold">{formatCAD(estimatedTotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-xs">
                      <span>Est. taxes (QC HST)</span>
                      <span>{formatCAD(estimatedTotal * 0.14975)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-xs">
                      <span>Platform commission (5%)</span>
                      <span>{formatCAD(estimatedTotal * 0.05)}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 flex justify-between font-bold">
                      <span>{t.poolDetail.totalEst}</span>
                      <span className="text-brand-700">{formatCAD(estimatedTotal * 1.19975)}</span>
                    </div>
                    <div className="text-success-600 font-semibold text-xs text-right">
                      You save {formatCAD((pool.soloPrice - tier.unitPrice) * qty)} vs. solo
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mb-4 text-center">{t.poolDetail.authorizeNote}</p>

                  <button onClick={handleJoin} className="btn-accent w-full text-base py-3.5">
                    {t.poolDetail.joinBtn}
                    <Shield size={16} />
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <Shield size={12} />
                    {t.poolDetail.paymentHeld}
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
                    <Check className="text-success-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{t.poolDetail.joined}</h3>
                  <p className="text-sm text-slate-500 mb-4">Payment hold placed. We&apos;ll notify you when the pool closes.</p>
                  <div className="animate-pulse text-brand-600 text-sm">Redirecting to dashboard...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer locale={locale} />
    </div>
  )
}
