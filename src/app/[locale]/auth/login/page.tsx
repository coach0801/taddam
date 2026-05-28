'use client'
import { useState } from 'react'
import Link from 'next/link'
import { type Locale, getTranslation } from '@/lib/i18n'
import { Eye, EyeOff, ArrowRight, Shield } from 'lucide-react'

export default function LoginPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const t = getTranslation(locale)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-accent-500/10 blur-3xl" />
        </div>
        <div className="relative text-center">
          <Link href={`/${locale}`} className="flex items-center justify-center gap-2 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-black text-2xl leading-none">t</span>
            </div>
            <span className="text-3xl font-black text-white tracking-tight">taddam</span>
          </Link>

          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            {t.auth.login.sidebarTitle}
          </h2>
          <p className="text-white/70 mb-10 leading-relaxed">
            {t.auth.login.sidebarSub}
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '2,400+', label: t.auth.login.stat1Label },
              { value: '$12.4M+', label: t.auth.login.stat2Label },
              { value: '150+', label: t.auth.login.stat3Label },
              { value: '23%', label: t.auth.login.stat4Label },
            ].map((s) => (
              <div key={s.label} className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-white/60 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel: form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center">
                <span className="text-white font-black text-xl leading-none">t</span>
              </div>
              <span className="text-2xl font-black text-brand-800 tracking-tight">taddam</span>
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{t.auth.login.title}</h1>
              <p className="text-slate-500 text-sm">{t.auth.login.sub}</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); window.location.href = `/${locale}/dashboard` }}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="label">{t.auth.login.email}</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="you@yourcompany.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="label mb-0">{t.auth.login.password}</label>
                    <Link href={`/${locale}/auth/forgot-password`} className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                      {t.auth.login.forgot}
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input pr-12"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full text-base py-3.5">
                {t.auth.login.submit}
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                {t.auth.login.noAccount}{' '}
                <Link href={`/${locale}/auth/register`} className="text-brand-600 font-semibold hover:text-brand-700">
                  {t.auth.login.register}
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Shield size={13} />
              <span>{t.auth.login.securityFooter}</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href={`/${locale}`} className="text-sm text-slate-500 hover:text-slate-700">
              {t.auth.login.backHome}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
