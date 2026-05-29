'use client'
import Link from 'next/link'
import { type Locale, getTranslation } from '@/lib/i18n'
import { Globe, MapPin } from 'lucide-react'

interface FooterProps {
  locale: Locale
}

const PROVINCES = ['ON', 'QC', 'BC', 'AB', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE']

export default function Footer({ locale }: FooterProps) {
  const t = getTranslation(locale)
  const otherLocale = locale === 'en' ? 'fr' : 'en'

  return (
    <footer className="bg-slate-900 text-slate-400">
      {/* Province coverage strip */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0">
              <MapPin size={12} className="text-maple-500" />
              {locale === 'en' ? 'Active across Canada:' : 'Actif partout au Canada :'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PROVINCES.map((p) => (
                <span key={p}
                  className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8">

          {/* Brand — full width on mobile, 2 cols on lg */}
          <div className="col-span-2 lg:col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <span className="text-white font-black text-lg leading-none">t</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-white tracking-tight">taddam</span>
                <span className="text-base" title="Made in Canada">🍁</span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed mb-5 max-w-xs">{t.footer.tagline}</p>

            {/* Canadian trust badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                { label: 'PIPEDA', icon: '🔒' },
                { label: locale === 'en' ? 'Canadian data' : 'Données au Canada', icon: '🍁' },
                { label: locale === 'en' ? 'Bilingual' : 'Bilingue', icon: '🇨🇦' },
              ].map((badge) => (
                <span key={badge.label}
                  className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  {badge.icon} {badge.label}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link href={`/${otherLocale}`}
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <Globe size={14} />
                {t.footer.language}
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">{t.footer.product}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href={`/${locale}#how-it-works`} className="hover:text-white transition-colors">{t.footer.howItWorks}</Link></li>
              <li><Link href={`/${locale}/pools`} className="hover:text-white transition-colors">{t.footer.browsePools}</Link></li>
              <li><Link href={`/${locale}/pools/create`} className="hover:text-white transition-colors">{t.footer.createPool}</Link></li>
              <li><Link href={`/${locale}/pools`} className="hover:text-white transition-colors">{t.footer.catalogue}</Link></li>
            </ul>
          </div>

          {/* Suppliers */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">{t.footer.suppliers}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href={`/${locale}/supplier`} className="hover:text-white transition-colors">{t.footer.supplierPortal}</Link></li>
              <li><Link href={`/${locale}/auth/register`} className="hover:text-white transition-colors">{t.footer.getVerified}</Link></li>
              <li><Link href={`/${locale}/supplier`} className="hover:text-white transition-colors">{t.footer.priceLadders}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">{t.footer.legal}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">{t.footer.privacy}</Link></li>
              <li><Link href={`/${locale}/terms`} className="hover:text-white transition-colors">{t.footer.terms}</Link></li>
              <li><Link href={`/${locale}/cookies`} className="hover:text-white transition-colors">{t.footer.cookies}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-8 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-slate-500">{t.footer.copyright}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success-400 inline-block animate-pulse flex-shrink-0" />
                {locale === 'fr' ? 'Tous les systèmes opérationnels' : 'All systems operational'}
              </span>
              <span className="flex items-center gap-1">
                <span className="text-maple-500">🍁</span>
                GST/HST · PST · QST
              </span>
              <span>Stripe {locale === 'fr' ? 'sécurisé' : 'secured'}</span>
              <span>CRA {locale === 'fr' ? 'conforme' : 'compliant'}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
