'use client'
import { useState } from 'react'
import Link from 'next/link'
import { type Locale, getTranslation } from '@/lib/i18n'
import { ArrowRight, ArrowLeft, Check, Shield, Building2, Package } from 'lucide-react'
import { PROVINCES } from '@/lib/mock-data'

export default function RegisterPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const t = getTranslation(locale)
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<'buyer' | 'supplier'>('buyer')
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    orgName: '', bn: '', province: '', agreed: false,
  })

  const steps = [t.auth.register.step1, t.auth.register.step2, t.auth.register.step3]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 hero-gradient items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-accent-500/10 blur-3xl" />
        </div>
        <div className="relative w-full max-w-xs">
          <Link href={`/${locale}`} className="flex items-center gap-2 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-black text-2xl leading-none">t</span>
            </div>
            <span className="text-3xl font-black text-white tracking-tight">taddam</span>
          </Link>

          <h2 className="text-2xl font-bold text-white mb-6 leading-tight">
            {t.auth.register.title}
          </h2>
          <p className="text-white/70 mb-10 text-sm leading-relaxed">
            {t.auth.register.sub}
          </p>

          {/* Steps progress */}
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div key={s} className={`flex items-center gap-3 transition-all ${step > i + 1 ? 'opacity-100' : step === i + 1 ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all ${step > i + 1 ? 'bg-success-500 text-white' : step === i + 1 ? 'bg-white text-brand-800' : 'bg-white/20 text-white'}`}>
                  {step > i + 1 ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-sm font-medium ${step === i + 1 ? 'text-white' : 'text-white/70'}`}>{s}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 glass rounded-2xl p-4">
            <div className="flex items-center gap-2 text-white/90 text-sm font-medium mb-2">
              <Shield size={14} className="text-success-400" />
              Secure & compliant
            </div>
            <ul className="space-y-1.5 text-xs text-white/60">
              <li className="flex items-center gap-1.5"><Check size={11} className="text-success-400" /> PIPEDA compliant</li>
              <li className="flex items-center gap-1.5"><Check size={11} className="text-success-400" /> Quebec Law 25 (Bill 96)</li>
              <li className="flex items-center gap-1.5"><Check size={11} className="text-success-400" /> Data hosted in Canada</li>
              <li className="flex items-center gap-1.5"><Check size={11} className="text-success-400" /> Stripe KYC for suppliers</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center">
                <span className="text-white font-black text-xl leading-none">t</span>
              </div>
              <span className="text-2xl font-black text-brand-800 tracking-tight">taddam</span>
            </Link>
          </div>

          {/* Mobile step indicator */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step === i + 1 ? 'w-8 bg-brand-600' : step > i + 1 ? 'w-6 bg-success-500' : 'w-4 bg-slate-300'}`} />
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            {/* Step 1: Role selection */}
            {step === 1 && (
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{t.auth.register.title}</h1>
                <p className="text-slate-500 text-sm mb-8">{t.auth.register.roleLabel}</p>

                <div className="space-y-4 mb-8">
                  {[
                    {
                      value: 'buyer' as const,
                      icon: Package,
                      label: t.auth.register.buyer,
                      desc: t.auth.register.buyerDesc,
                    },
                    {
                      value: 'supplier' as const,
                      icon: Building2,
                      label: t.auth.register.supplier,
                      desc: t.auth.register.supplierDesc,
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setRole(option.value)}
                      className={`w-full flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                        role === option.value
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${role === option.value ? 'bg-brand-100' : 'bg-slate-100'}`}>
                        <option.icon className={role === option.value ? 'text-brand-600' : 'text-slate-500'} size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900">{option.label}</p>
                          {role === option.value && (
                            <span className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
                              <Check size={12} className="text-white" />
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">{option.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <button onClick={() => setStep(2)} className="btn-primary w-full text-base py-3.5">
                  {t.auth.register.next}
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* Step 2: Personal details */}
            {step === 2 && (
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{t.auth.register.step2}</h1>
                <p className="text-slate-500 text-sm mb-6">{t.auth.register.step2Desc}</p>

                <div className="space-y-4 mb-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">{t.auth.register.firstName}</label>
                      <input type="text" className="input" placeholder="Jean" value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                    </div>
                    <div>
                      <label className="label">{t.auth.register.lastName}</label>
                      <input type="text" className="input" placeholder="Dupont" value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="label">{t.auth.register.email}</label>
                    <input type="email" className="input" placeholder="jean@entreprise.com" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">{t.auth.register.password}</label>
                    <input type="password" className="input" placeholder="Min. 12 characters" value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    <p className="text-xs text-slate-400 mt-1">{t.auth.register.passwordHint}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-ghost border border-slate-200">
                    <ArrowLeft size={16} /> {t.auth.register.back}
                  </button>
                  <button onClick={() => setStep(3)} className="btn-primary flex-1 text-base py-3">
                    {t.auth.register.next} <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Organization */}
            {step === 3 && (
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{t.auth.register.step3}</h1>
                <p className="text-slate-500 text-sm mb-6">{t.auth.register.step3Desc}</p>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="label">{t.auth.register.orgName}</label>
                    <input type="text" className="input" placeholder="Entreprise XYZ Inc." value={form.orgName}
                      onChange={(e) => setForm({ ...form, orgName: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">{t.auth.register.businessNumber}</label>
                    <input type="text" className="input" placeholder="123456789" value={form.bn}
                      onChange={(e) => setForm({ ...form, bn: e.target.value })} />
                    <p className="text-xs text-slate-400 mt-1">{t.auth.register.bnHint}</p>
                  </div>
                  <div>
                    <label className="label">{t.auth.register.province}</label>
                    <select className="input" value={form.province}
                      onChange={(e) => setForm({ ...form, province: e.target.value })}>
                      <option value="">Select province...</option>
                      {PROVINCES.map((p) => (
                        <option key={p.code} value={p.code}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <input
                      type="checkbox"
                      id="agree"
                      className="mt-0.5 w-4 h-4 accent-brand-600 cursor-pointer"
                      checked={form.agreed}
                      onChange={(e) => setForm({ ...form, agreed: e.target.checked })}
                    />
                    <label htmlFor="agree" className="text-sm text-slate-600 cursor-pointer">
                      {t.auth.register.agree}{' '}
                      <Link href={`/${locale}/terms`} className="text-brand-600 font-medium hover:underline">{t.auth.register.terms}</Link>
                      {' '}{t.auth.register.and}{' '}
                      <Link href={`/${locale}/privacy`} className="text-brand-600 font-medium hover:underline">{t.auth.register.privacy}</Link>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-ghost border border-slate-200">
                    <ArrowLeft size={16} /> {t.auth.register.back}
                  </button>
                  <Link
                    href={`/${locale}/dashboard`}
                    className="btn-accent flex-1 text-center text-base py-3"
                  >
                    {t.auth.register.submit} <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                {t.auth.register.hasAccount}{' '}
                <Link href={`/${locale}/auth/login`} className="text-brand-600 font-semibold hover:text-brand-700">
                  {t.auth.register.login}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
