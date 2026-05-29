'use client'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import { type Locale, getTranslation } from '@/lib/i18n'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  ArrowRight, Play, CheckCircle, TrendingDown, Users, Shield, Truck,
  Globe, FileText, BarChart3, Zap, ChevronRight, Star, Quote,
  Package, Building2, UtensilsCrossed, ShoppingBag, ChevronDown,
  Check
} from 'lucide-react'
import { formatCAD, getSavingsPct } from '@/lib/mock-data'

const DEMO_TIERS = [
  { minQty: 1, maxQty: 99, unitPrice: 118 },
  { minQty: 100, maxQty: 249, unitPrice: 98 },
  { minQty: 250, maxQty: 499, unitPrice: 82 },
  { minQty: 500, maxQty: null, unitPrice: 67 },
]
const SOLO_PRICE = 145

function getDemoTierIndex(qty: number) {
  for (let i = 0; i < DEMO_TIERS.length; i++) {
    const t = DEMO_TIERS[i]
    if (qty >= t.minQty && (t.maxQty === null || qty <= t.maxQty)) return i
  }
  return 0
}

function LivePoolWidget({ locale }: { locale: Locale }) {
  const t = getTranslation(locale)
  const pool = {
    sku: locale === 'fr' ? 'Pneu toutes saisons 205/55R16 — Marque X' : '205/55R16 All-Season Tire — Brand X',
    committed: 287,
    target: 500,
    minimum: 100,
    participants: 14,
    closingIn: '3d 4h',
  }
  const tierIdx = getDemoTierIndex(pool.committed)
  const currentTier = DEMO_TIERS[tierIdx]
  const nextTier = DEMO_TIERS[tierIdx + 1]
  const pct = Math.round((pool.committed / pool.target) * 100)
  const savings = getSavingsPct(SOLO_PRICE, currentTier.unitPrice)

  return (
    <div className="glass rounded-2xl p-6 w-full max-w-sm shadow-2xl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="badge-green mb-2">🟢 Live pool</span>
          <h4 className="text-white font-semibold text-sm mt-1 leading-tight">{pool.sku}</h4>
        </div>
        <span className="text-2xl">🚗</span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-white/70 mb-1.5">
          <span>{pool.committed} / {pool.target} units</span>
          <span>{pct}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-success-400 to-success-500 transition-all duration-700"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        {nextTier && (
          <p className="text-xs text-white/60 mt-1.5">
            🎯 {nextTier.minQty - pool.committed} more units → {formatCAD(nextTier.unitPrice)}/unit
          </p>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-white/60">{locale === 'fr' ? 'Prix actuel' : 'Current price'}</p>
          <p className="text-3xl font-black text-white price-display">{formatCAD(currentTier.unitPrice)}</p>
          <p className="text-xs text-success-400 font-medium">↓ {savings}% {locale === 'fr' ? 'vs. achat individuel' : 'vs. solo purchase'}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/60">{pool.participants} {locale === 'fr' ? 'acheteurs' : 'buyers'}</p>
          <p className="text-xs text-white/60">{locale === 'fr' ? 'Ferme dans' : 'Closes in'} {pool.closingIn}</p>
        </div>
      </div>
    </div>
  )
}

function DynamicPricingDemo({ locale }: { locale: Locale }) {
  const t = getTranslation(locale)
  const [buyers, setBuyers] = useState(75)
  const unitsPerBuyer = 4
  const totalUnits = buyers * unitsPerBuyer
  const tierIdx = getDemoTierIndex(totalUnits)
  const currentTier = DEMO_TIERS[tierIdx]
  const nextTier = DEMO_TIERS[tierIdx + 1]
  const savings = getSavingsPct(SOLO_PRICE, currentTier.unitPrice)
  const maxBuyers = 140

  const getProgressColor = (pct: number) => {
    if (pct < 40) return 'pool-progress-low'
    if (pct < 70) return 'pool-progress-mid'
    return 'pool-progress-high'
  }

  return (
    <section id="demo" className="py-16 sm:py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 text-sm font-semibold mb-4">
            <Zap size={15} />
            {locale === 'en' ? 'Interactive demo' : 'Démo interactive'}
          </span>
          <h2 className="section-title mb-4">{t.pricingDemo.title}</h2>
          <p className="section-sub max-w-2xl mx-auto">{t.pricingDemo.sub}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="card-elevated p-8 lg:p-12">
            {/* Product header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-8 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl">🚗</div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Automotive · Tires</p>
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">{t.pricingDemo.product}</h3>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 mb-1">{t.pricingDemo.savings} {formatCAD(SOLO_PRICE)}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 price-display tabular-nums">
                    {formatCAD(currentTier.unitPrice)}
                  </span>
                  <span className="text-slate-500 text-sm">{t.pricingDemo.perUnit}</span>
                </div>
                <div className="mt-1">
                  <span className={`text-lg font-bold transition-all duration-300 ${savings > 30 ? 'text-success-600' : savings > 15 ? 'text-brand-600' : 'text-slate-500'}`}>
                    ↓ {savings}% {t.pricingDemo.youSave}
                  </span>
                </div>
              </div>
            </div>

            {/* Slider */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold text-slate-700">
                  {t.pricingDemo.buyers}: <span className="text-brand-700 text-lg font-black">{buyers}</span>
                </label>
                <span className="badge-blue">
                  {totalUnits} {t.pricingDemo.units} total
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={maxBuyers}
                value={buyers}
                onChange={(e) => setBuyers(Number(e.target.value))}
                className="w-full"
                aria-label="Number of buyers in pool"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                <span>1 buyer</span>
                <span>{maxBuyers} buyers</span>
              </div>
            </div>

            {/* Tier progress */}
            <div className="mb-8">
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span>{totalUnits} {t.pricingDemo.units}</span>
                <span>
                  {nextTier
                    ? `${t.pricingDemo.next} ${nextTier.minQty} units (${Math.round((nextTier.minQty - totalUnits))} to go)`
                    : '🏆 Best tier reached!'}
                </span>
              </div>
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor((totalUnits / 500) * 100)}`}
                  style={{ width: `${Math.min((totalUnits / 500) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Price tiers grid */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t.pricingDemo.tiers}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DEMO_TIERS.map((tier, i) => {
                  const isActive = i === tierIdx
                  const isNext = i === tierIdx + 1
                  const isUnlocked = i < tierIdx
                  const savPct = getSavingsPct(SOLO_PRICE, tier.unitPrice)

                  return (
                    <div
                      key={i}
                      className={`tier-row ${isActive ? 'tier-active' : isNext ? 'tier-next' : isUnlocked ? 'bg-slate-50 border border-slate-200 opacity-70' : 'tier-inactive opacity-50'}`}
                    >
                      <div className="flex items-center gap-2">
                        {isActive && <span className="text-success-600">✓</span>}
                        {isUnlocked && <span className="text-slate-400">✓</span>}
                        {!isActive && !isUnlocked && <span className="w-4 h-4 rounded-full border-2 border-slate-300 inline-block flex-shrink-0" />}
                        <div>
                          <p className="text-xs text-slate-500">
                            {tier.minQty}–{tier.maxQty ?? '∞'} units
                          </p>
                          <p className={`font-bold text-sm ${isActive ? 'text-success-700' : 'text-slate-700'}`}>
                            {formatCAD(tier.unitPrice)}/unit
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-semibold ${isActive ? 'text-success-600' : 'text-slate-500'}`}>
                          -{savPct}%
                        </span>
                        {isActive && (
                          <p className="text-xs text-success-600 font-medium mt-0.5">{t.pricingDemo.unlocked}</p>
                        )}
                        {isNext && (
                          <p className="text-xs text-brand-600 font-medium mt-0.5">{t.pricingDemo.next} {tier.minQty}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function LandingPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const t = getTranslation(locale)

  return (
    <div className="min-h-screen">
      <Navbar locale={locale} transparent />

      {/* ═══════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════ */}
      <section className="hero-gradient min-h-screen flex items-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-accent-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl">
            <svg className="w-full h-full opacity-5" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="400" cy="300" r="200" stroke="white" strokeWidth="1" strokeDasharray="8 4" />
              <circle cx="400" cy="300" r="120" stroke="white" strokeWidth="1" strokeDasharray="4 8" />
              <circle cx="400" cy="300" r="300" stroke="white" strokeWidth="0.5" strokeDasharray="2 12" />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: copy */}
            <div className="animate-fade-in">
              {/* Live badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-success-400 animate-pulse inline-block flex-shrink-0" />
                {t.hero.badge}
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-5">
                {t.hero.headline1}
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-400 to-accent-300">
                  {t.hero.headline2}
                </span>
              </h1>

              <p className="text-base sm:text-xl text-white/75 leading-relaxed mb-7 max-w-xl">
                {t.hero.sub}
              </p>

              {/* Province coverage strip */}
              <div className="flex flex-wrap items-center gap-1.5 mb-8">
                <span className="text-xs text-white/50 mr-1">
                  {locale === 'en' ? 'Active in:' : 'Actif en :'}
                </span>
                {['ON', 'QC', 'BC', 'AB', 'MB', 'SK', 'NS', 'NB'].map((p) => (
                  <span key={p} className="text-xs font-semibold px-2 py-0.5 rounded bg-white/10 border border-white/20 text-white/60">
                    {p}
                  </span>
                ))}
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/10 border border-white/20 text-white/60">+</span>
              </div>

              {/* CTA buttons — stack on mobile, row on sm+ */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10">
                <Link
                  href={`/${locale}/auth/register`}
                  className="btn-maple text-base px-8 py-4 shadow-lg hover:shadow-xl justify-center"
                >
                  {t.hero.ctaBuyer}
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href={`/${locale}/auth/register`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all duration-200"
                >
                  {t.hero.ctaSupplier}
                </Link>
              </div>

              <button className="inline-flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                  <Play size={14} fill="currentColor" />
                </div>
                <span className="text-sm font-medium">{t.hero.watchDemo}</span>
              </button>
            </div>

            {/* Right: live pool widget */}
            <div className="flex justify-center lg:justify-end animate-slide-up mt-4 lg:mt-0">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-full h-full rounded-2xl bg-white/5 border border-white/10 transform rotate-3 hidden sm:block" />
                <LivePoolWidget locale={locale} />

                {/* Floating badges — hidden on xs, visible on sm+ */}
                <div className="hidden sm:flex absolute -top-4 -right-4 bg-success-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-bounce">
                  {locale === 'fr' ? 'Prix en baisse ! ↓ 43 %' : 'Price dropped! ↓ 43%'}
                </div>
                <div className="hidden sm:flex absolute -bottom-4 -left-4 bg-white rounded-xl px-4 py-2 shadow-xl items-center gap-2">
                  <Users size={14} className="text-brand-600" />
                  <span className="text-xs font-semibold text-slate-700">
                    {locale === 'fr' ? '14 acheteurs aujourd\'hui' : '14 buyers joined today'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-14 sm:mt-20 pt-10 sm:pt-12 border-t border-white/10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              {[
                { value: t.hero.stat1Value, label: t.hero.stat1Label },
                { value: t.hero.stat2Value, label: t.hero.stat2Label },
                { value: t.hero.stat3Value, label: t.hero.stat3Label },
                { value: t.hero.stat4Value, label: t.hero.stat4Label },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-4xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-white/60 leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-white/40" size={24} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════ */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-700 text-sm font-semibold mb-4">
              {locale === 'en' ? 'Simple & transparent' : 'Simple et transparent'}
            </span>
            <h2 className="section-title mb-4">{t.howItWorks.title}</h2>
            <p className="section-sub max-w-2xl mx-auto">{t.howItWorks.sub}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            {[
              {
                step: '01',
                icon: Package,
                color: 'from-brand-500 to-brand-700',
                bgColor: 'bg-brand-50',
                title: t.howItWorks.step1Title,
                desc: t.howItWorks.step1Desc,
              },
              {
                step: '02',
                icon: Users,
                color: 'from-accent-500 to-accent-600',
                bgColor: 'bg-accent-50',
                title: t.howItWorks.step2Title,
                desc: t.howItWorks.step2Desc,
              },
              {
                step: '03',
                icon: TrendingDown,
                color: 'from-success-500 to-success-700',
                bgColor: 'bg-success-50',
                title: t.howItWorks.step3Title,
                desc: t.howItWorks.step3Desc,
              },
            ].map((item) => (
              <div key={item.step} className="relative group">
                <div className="card p-8 h-full hover:border-brand-200 transition-colors">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="text-white" size={28} />
                  </div>
                  <div className="text-6xl font-black text-slate-100 absolute top-6 right-6">{item.step}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 relative">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed relative">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          DYNAMIC PRICING DEMO
      ═══════════════════════════════════════════ */}
      <DynamicPricingDemo locale={locale} />

      {/* ═══════════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════════ */}
      <section id="features" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-maple-50 text-maple-700 text-sm font-semibold mb-4">
              🍁 {locale === 'en' ? 'Built for Canadian SMEs' : 'Conçu pour les PME canadiennes'}
            </span>
            <h2 className="section-title mb-4">{t.features.title}</h2>
            <p className="section-sub max-w-2xl mx-auto">{t.features.sub}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: t.features.f1Title, desc: t.features.f1Desc, color: 'text-brand-600', bg: 'bg-brand-50' },
              { icon: Building2, title: t.features.f2Title, desc: t.features.f2Desc, color: 'text-accent-600', bg: 'bg-accent-50' },
              { icon: TrendingDown, title: t.features.f3Title, desc: t.features.f3Desc, color: 'text-success-600', bg: 'bg-success-50' },
              { icon: Shield, title: t.features.f4Title, desc: t.features.f4Desc, color: 'text-violet-600', bg: 'bg-violet-50' },
              { icon: Truck, title: t.features.f5Title, desc: t.features.f5Desc, color: 'text-sky-600', bg: 'bg-sky-50' },
              { icon: Globe, title: t.features.f6Title, desc: t.features.f6Desc, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: FileText, title: t.features.f7Title, desc: t.features.f7Desc, color: 'text-amber-600', bg: 'bg-amber-50' },
              { icon: BarChart3, title: t.features.f8Title, desc: t.features.f8Desc, color: 'text-rose-600', bg: 'bg-rose-50' },
            ].map((feature) => (
              <div key={feature.title} className="card p-6 hover:border-brand-200 hover:-translate-y-1 transition-all duration-300 group">
                <div className={`w-11 h-11 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={feature.color} size={22} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-sm">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CATEGORIES
      ═══════════════════════════════════════════ */}
      <section id="categories" className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="section-title mb-4">{t.categories.title}</h2>
            <p className="section-sub max-w-2xl mx-auto">{t.categories.sub}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-10">
            {[
              { emoji: '🚗', name: t.categories.auto, desc: t.categories.autoDesc, color: 'from-blue-500 to-blue-700', savings: '28%', poolsActive: 12 },
              { emoji: '🏗️', name: t.categories.construction, desc: t.categories.constructionDesc, color: 'from-amber-500 to-amber-700', savings: '31%', poolsActive: 9 },
              { emoji: '🍽️', name: t.categories.restaurant, desc: t.categories.restaurantDesc, color: 'from-rose-500 to-rose-700', savings: '24%', poolsActive: 7 },
              {
                emoji: '🌾',
                name: locale === 'en' ? 'Agriculture & Farm' : 'Agriculture',
                desc: locale === 'en' ? 'Seed, feed, fertilizer, equipment parts' : 'Semences, aliments, engrais, pièces',
                color: 'from-green-600 to-green-800',
                savings: '26%',
                poolsActive: 6,
              },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={`/${locale}/pools`}
                className="card p-6 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  {cat.emoji}
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{cat.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{cat.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="badge-green">avg {cat.savings} saved</span>
                  <span className="text-xs text-slate-500">{cat.poolsActive} active pools</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href={`/${locale}/pools`} className="btn-outline">
              {t.categories.explore}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════ */}
      <section id="testimonials" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-maple-50 text-maple-700 text-sm font-semibold mb-4">
              🇨🇦 {t.testimonials.title}
            </span>
            <h2 className="section-title">{locale === 'en' ? 'Real savings. Real businesses.' : 'De vraies économies. De vraies entreprises.'}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 sm:gap-8">
            {[
              { quote: t.testimonials.t1Quote, name: t.testimonials.t1Name, role: t.testimonials.t1Role, emoji: '🚗', savings: '28%' },
              { quote: t.testimonials.t2Quote, name: t.testimonials.t2Name, role: t.testimonials.t2Role, emoji: '🏗️', savings: '31%' },
              { quote: t.testimonials.t3Quote, name: t.testimonials.t3Name, role: t.testimonials.t3Role, emoji: '🏭', savings: null, isSupplier: true },
            ].map((t) => (
              <div key={t.name} className="card p-8 relative">
                <Quote className="absolute top-6 right-6 text-slate-100" size={40} />
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 leading-relaxed mb-6 italic relative">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-brand-100 flex items-center justify-center text-xl">
                    {t.emoji}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                  {t.savings && (
                    <span className="ml-auto badge-green">↓ {t.savings}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CANADIAN TRUST BAND
      ═══════════════════════════════════════════ */}
      <section className="bg-maple-600 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 text-white/90 text-sm text-center">
            {[
              { icon: '🍁', text: locale === 'en' ? 'Made in Canada' : 'Fait au Canada' },
              { icon: '🔒', text: locale === 'en' ? 'PIPEDA compliant' : 'Conforme LPRPDE' },
              { icon: '🏛️', text: locale === 'en' ? 'CRA Business Numbers' : 'Numéros d\'entreprise ARC' },
              { icon: '💬', text: locale === 'en' ? 'Bilingual EN / FR' : 'Bilingue EN / FR' },
              { icon: '🇨🇦', text: locale === 'en' ? 'Canadian data residency' : 'Données hébergées au Canada' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 font-medium">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PRICING
      ═══════════════════════════════════════════ */}
      <section id="pricing" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="section-title mb-4">{t.pricingSection.title}</h2>
            <p className="section-sub max-w-2xl mx-auto">{t.pricingSection.sub}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Buyer Free */}
            <div className="card p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{t.pricingSection.buyerTitle}</h3>
                <p className="text-slate-500 text-sm">{t.pricingSection.buyerDesc}</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-black text-slate-900">$0</span>
                <span className="text-slate-500 text-sm">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {t.pricingSection.buyerFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Check size={16} className="text-success-600 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/auth/register`} className="btn-outline w-full text-center">
                {t.pricingSection.cta}
              </Link>
            </div>

            {/* Premium */}
            <div className="card-elevated p-8 border-2 border-brand-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="badge-blue px-4 py-1 text-xs font-bold">{t.pricingSection.premiumBadge}</span>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{t.pricingSection.premiumTitle}</h3>
                <p className="text-slate-500 text-sm">{t.pricingSection.premiumDesc}</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-black text-brand-700">$79</span>
                <span className="text-slate-500 text-sm">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {t.pricingSection.premiumFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Check size={16} className="text-brand-600 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/auth/register`} className="btn-primary w-full text-center">
                {t.pricingSection.cta}
              </Link>
            </div>

            {/* Supplier */}
            <div className="card p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{t.pricingSection.supplierTitle}</h3>
                <p className="text-slate-500 text-sm">{t.pricingSection.supplierDesc}</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-black text-slate-900">Free</span>
                <span className="text-slate-500 text-sm"> to join</span>
              </div>
              <ul className="space-y-3 mb-8">
                {t.pricingSection.supplierFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Check size={16} className="text-success-600 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/auth/register`} className="btn-outline w-full text-center">
                {t.pricingSection.cta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-br from-brand-800 to-brand-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-accent-500/10 blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
            {t.cta.title}
          </h2>
          <p className="text-xl text-white/70 mb-10 leading-relaxed">
            {t.cta.sub}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8">
            <Link href={`/${locale}/auth/register`} className="btn-maple text-base px-10 py-4 shadow-xl justify-center">
              {t.cta.ctaBuyer}
              <ArrowRight size={18} />
            </Link>
            <Link
              href={`/${locale}/auth/register`}
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl text-base font-semibold text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all"
            >
              {t.cta.ctaSupplier}
            </Link>
          </div>
          <p className="text-sm text-white/50">{t.cta.trust}</p>
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  )
}
