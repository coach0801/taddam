'use client'
import Link from 'next/link'
import { type Locale, getTranslation } from '@/lib/i18n'
import { Globe, MapPin } from 'lucide-react'

interface FooterProps {
  locale: Locale
}

export default function Footer({ locale }: FooterProps) {
  const t = getTranslation(locale)
  const otherLocale = locale === 'en' ? 'fr' : 'en'

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <span className="text-white font-black text-lg leading-none">t</span>
              </div>
              <span className="text-xl font-black text-white tracking-tight">taddam</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">{t.footer.tagline}</p>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <MapPin size={14} className="text-success-400" />
              <span>{t.footer.madeIn} 🍁</span>
            </div>
            <Link
              href={`/${otherLocale}`}
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <Globe size={15} />
              {t.footer.language}
            </Link>
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

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">{t.footer.copyright}</p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success-400 inline-block animate-pulse"></span>
              {locale === 'fr' ? 'Tous les systèmes opérationnels' : 'All systems operational'}
            </span>
            <span>GST/HST/PST/QST {locale === 'fr' ? 'conforme' : 'compliant'}</span>
            <span>Stripe {locale === 'fr' ? 'sécurisé' : 'secured'}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
