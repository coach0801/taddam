'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { type Locale, getTranslation } from '@/lib/i18n'
import { Menu, X, Globe } from 'lucide-react'

interface NavbarProps {
  locale: Locale
  transparent?: boolean
}

export default function Navbar({ locale, transparent = false }: NavbarProps) {
  const t = getTranslation(locale)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const otherLocale = locale === 'en' ? 'fr' : 'en'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isTransparentMode = transparent && !scrolled && !mobileOpen
  const navBg = isTransparentMode
    ? 'bg-transparent'
    : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/60'
  const textColor = isTransparentMode ? 'text-white' : 'text-slate-700'
  const logoColor = isTransparentMode ? 'text-white' : 'text-brand-800'

  return (
    <>
      {/* Maple red accent bar — distinctly Canadian top stripe */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-maple-600 z-50" />

      <nav className={`fixed top-[3px] left-0 right-0 z-40 transition-all duration-300 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-white font-black text-lg leading-none">t</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-xl font-black tracking-tight transition-colors ${logoColor}`}>
                  taddam
                </span>
                <span className="text-base leading-none select-none" title="Made in Canada">🍁</span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              <Link href={`/${locale}#how-it-works`}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/10 ${textColor}`}>
                {t.nav.howItWorks}
              </Link>
              <Link href={`/${locale}/pools`}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/10 ${textColor}`}>
                {t.nav.pools}
              </Link>
              <Link href={`/${locale}/supplier`}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/10 ${textColor}`}>
                {t.nav.suppliers}
              </Link>
              <Link href={`/${locale}#pricing`}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/10 ${textColor}`}>
                {t.nav.pricing}
              </Link>
            </div>

            {/* Desktop right side */}
            <div className="hidden md:flex items-center gap-3">
              <Link href={`/${otherLocale}`}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors border ${
                  isTransparentMode
                    ? 'border-white/25 text-white/80 hover:bg-white/10'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}>
                <Globe size={14} />
                {t.footer.language}
              </Link>
              <Link href={`/${locale}/auth/login`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/10 ${textColor}`}>
                {t.nav.login}
              </Link>
              <Link href={`/${locale}/auth/register`}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-maple-600 hover:bg-maple-700 transition-all duration-200 shadow-sm hover:shadow-md">
                {t.nav.register}
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2.5 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${textColor} hover:bg-white/10`}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu — smooth slide-down */}
        <div className={`md:hidden bg-white border-t border-slate-100 shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-4 py-3 space-y-0.5">
            {[
              { href: `/${locale}#how-it-works`, label: t.nav.howItWorks },
              { href: `/${locale}/pools`,         label: t.nav.pools },
              { href: `/${locale}/supplier`,       label: t.nav.suppliers },
              { href: `/${locale}#pricing`,        label: t.nav.pricing },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-4 py-3.5 rounded-xl text-slate-700 font-medium hover:bg-slate-50 active:bg-slate-100 transition-colors text-[15px] min-h-[52px]"
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-2 mt-1 border-t border-slate-100">
              <div className="flex gap-3 mb-3">
                <Link href={`/${otherLocale}`} onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 flex-1 px-4 py-3 rounded-xl text-slate-600 font-medium border border-slate-200 hover:bg-slate-50 transition-colors text-sm min-h-[48px]">
                  <Globe size={15} />
                  {t.footer.language}
                </Link>
                <Link href={`/${locale}/auth/login`} onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center flex-1 px-4 py-3 rounded-xl text-slate-700 font-medium border border-slate-200 hover:bg-slate-50 transition-colors text-sm min-h-[48px]">
                  {t.nav.login}
                </Link>
              </div>
              <Link href={`/${locale}/auth/register`} onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-4 rounded-xl text-white font-bold bg-maple-600 hover:bg-maple-700 active:bg-maple-800 transition-colors text-base min-h-[52px]">
                {t.nav.register}
              </Link>
            </div>

            <p className="text-center text-xs text-slate-400 pt-3 pb-1">
              🍁 {locale === 'en' ? 'Proudly Canadian · Bilingual · PIPEDA compliant' : 'Fièrement canadien · Bilingue · Conforme LPRPDE'}
            </p>
          </div>
        </div>
      </nav>
    </>
  )
}
