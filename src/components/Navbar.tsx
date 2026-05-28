'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { type Locale, getTranslation } from '@/lib/i18n'
import { Menu, X, ChevronDown, Globe } from 'lucide-react'

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

  const navBg = transparent && !scrolled && !mobileOpen
    ? 'bg-transparent'
    : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/60'

  const textColor = transparent && !scrolled && !mobileOpen
    ? 'text-white'
    : 'text-slate-700'

  const logoColor = transparent && !scrolled && !mobileOpen
    ? 'text-white'
    : 'text-brand-800'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-black text-lg leading-none">t</span>
            </div>
            <span className={`text-xl font-black tracking-tight transition-colors ${logoColor}`}>
              taddam
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href={`/${locale}#how-it-works`}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/10 ${textColor}`}
            >
              {t.nav.howItWorks}
            </Link>
            <Link
              href={`/${locale}/pools`}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/10 ${textColor}`}
            >
              {t.nav.pools}
            </Link>
            <Link
              href={`/${locale}/supplier`}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/10 ${textColor}`}
            >
              {t.nav.suppliers}
            </Link>
            <Link
              href={`/${locale}#pricing`}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/10 ${textColor}`}
            >
              {t.nav.pricing}
            </Link>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language toggle */}
            <Link
              href={`/${otherLocale}`}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/10 ${textColor}`}
            >
              <Globe size={15} />
              {t.footer.language}
            </Link>

            <Link
              href={`/${locale}/auth/login`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/10 ${textColor}`}
            >
              {t.nav.login}
            </Link>
            <Link
              href={`/${locale}/auth/register`}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-accent-500 hover:bg-accent-600 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {t.nav.register}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${textColor} hover:bg-white/10`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            <Link href={`/${locale}#how-it-works`} onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors">
              {t.nav.howItWorks}
            </Link>
            <Link href={`/${locale}/pools`} onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors">
              {t.nav.pools}
            </Link>
            <Link href={`/${locale}/supplier`} onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors">
              {t.nav.suppliers}
            </Link>
            <Link href={`/${locale}#pricing`} onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors">
              {t.nav.pricing}
            </Link>
            <hr className="my-2 border-slate-200" />
            <Link href={`/${otherLocale}`} onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors">
              <Globe size={16} />
              {t.footer.language}
            </Link>
            <Link href={`/${locale}/auth/login`} onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors">
              {t.nav.login}
            </Link>
            <Link href={`/${locale}/auth/register`} onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-white font-semibold bg-accent-500 hover:bg-accent-600 transition-colors text-center mt-2">
              {t.nav.register}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
