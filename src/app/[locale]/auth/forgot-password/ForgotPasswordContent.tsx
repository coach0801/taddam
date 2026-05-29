'use client'
import { useState } from 'react'
import Link from 'next/link'
import { type Locale, getTranslation } from '@/lib/i18n'
import { ArrowRight, Shield, Mail, Check, Loader2 } from 'lucide-react'

export default function ForgotPasswordContent({ locale }: { locale: Locale }) {
  const t = getTranslation(locale)
  const fp = t.auth.forgotPassword
  const isFr = locale === 'fr'
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      })
    } catch {}
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-accent-500/10 blur-3xl" />
        </div>
        <div className="relative text-center max-w-xs">
          <Link href={`/${locale}`} className="flex items-center justify-center gap-2 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-black text-2xl leading-none">t</span>
            </div>
            <span className="text-3xl font-black text-white tracking-tight">taddam</span>
          </Link>
          <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mx-auto mb-8">
            <Mail size={36} className="text-white/80" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">{fp.sidebarTitle}</h2>
          <p className="text-white/70 text-sm leading-relaxed">{fp.sidebarNote}</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center">
                <span className="text-white font-black text-xl leading-none">t</span>
              </div>
              <span className="text-2xl font-black text-brand-800 tracking-tight">taddam</span>
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            {!sent ? (
              <>
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">{fp.title}</h1>
                  <p className="text-slate-500 text-sm">{fp.sub}</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="label">{fp.email}</label>
                    <input type="email" className="input" placeholder="you@yourcompany.com"
                      value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3.5">
                    {loading
                      ? <><Loader2 size={16} className="animate-spin" /> {isFr ? 'Envoi…' : 'Sending…'}</>
                      : <>{fp.submit} <ArrowRight size={18} /></>}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-5">
                  <Check size={32} className="text-success-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{fp.sent}</h2>
                <p className="text-sm text-slate-500 leading-relaxed">{fp.sentSub}</p>
                <p className="text-sm font-semibold text-brand-700 mt-3 break-all">{email}</p>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link href={`/${locale}/auth/login`} className="text-sm text-brand-600 font-medium hover:text-brand-700">
                {fp.back}
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Shield size={13} />
              <span>{fp.securityFooter}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
