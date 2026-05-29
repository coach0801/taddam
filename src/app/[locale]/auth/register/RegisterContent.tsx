'use client'
import { useState } from 'react'
import Link from 'next/link'
import { type Locale, getTranslation } from '@/lib/i18n'
import { ArrowRight, ArrowLeft, Check, Shield, Building2, Package, Loader2, Mail } from 'lucide-react'

const PROVINCES = [
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'ON', name: 'Ontario' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'YT', name: 'Yukon' },
]

export default function RegisterContent({ locale }: { locale: Locale }) {
  const t = getTranslation(locale)
  const tr = t.auth.register
  const isFr = locale === 'fr'

  const [step, setStep] = useState(1)
  const [role, setRole] = useState<'BUYER' | 'SUPPLIER'>('BUYER')
  const [preferredLocale, setPreferredLocale] = useState<'en' | 'fr'>(locale)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')

  const [form, setForm] = useState({
    name: '',
    businessName: '',
    email: '',
    password: '',
    province: '',
    postalCode: '',
    phone: '',
  })

  const steps = [
    isFr ? 'Type de compte' : 'Account type',
    isFr ? 'Vos coordonnées' : 'Your details',
    isFr ? 'Organisation' : 'Organization',
  ]

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role, preferredLocale }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? (isFr ? 'Une erreur est survenue.' : 'An error occurred.'))
        setLoading(false)
        return
      }
      setRegisteredEmail(form.email)
      setSuccess(true)
    } catch {
      setError(isFr ? 'Erreur réseau.' : 'Network error.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-5">
            <Mail size={32} className="text-success-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{isFr ? 'Vérifiez votre boîte courriel' : 'Check your inbox'}</h1>
          <p className="text-slate-500 mb-2">{isFr ? 'Nous avons envoyé un lien de vérification à' : 'We sent a verification link to'}</p>
          <p className="font-bold text-brand-700 break-all mb-6">{registeredEmail}</p>
          <Link href={`/${locale}/auth/login`} className="btn-primary">
            {isFr ? 'Retour à la connexion' : 'Back to sign in'}
          </Link>
        </div>
      </div>
    )
  }

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
          <h2 className="text-2xl font-bold text-white mb-6 leading-tight">{tr.title}</h2>
          <p className="text-white/70 mb-10 text-sm leading-relaxed">{tr.sub}</p>
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
              {isFr ? 'Sécurisé et conforme' : 'Secure & compliant'}
            </div>
            <ul className="space-y-1.5 text-xs text-white/60">
              <li className="flex items-center gap-1.5"><Check size={11} className="text-success-400" /> PIPEDA compliant</li>
              <li className="flex items-center gap-1.5"><Check size={11} className="text-success-400" /> Quebec Law 25 (Bill 96)</li>
              <li className="flex items-center gap-1.5"><Check size={11} className="text-success-400" /> {isFr ? 'Données hébergées au Canada' : 'Data hosted in Canada'}</li>
              <li className="flex items-center gap-1.5"><Check size={11} className="text-success-400" /> Stripe KYC {isFr ? 'pour fournisseurs' : 'for suppliers'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="lg:hidden flex justify-center mb-8">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center">
                <span className="text-white font-black text-xl leading-none">t</span>
              </div>
              <span className="text-2xl font-black text-brand-800 tracking-tight">taddam</span>
            </Link>
          </div>
          <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step === i + 1 ? 'w-8 bg-brand-600' : step > i + 1 ? 'w-6 bg-success-500' : 'w-4 bg-slate-300'}`} />
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            {/* Step 1: Role selection */}
            {step === 1 && (
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{tr.title}</h1>
                <p className="text-slate-500 text-sm mb-8">{isFr ? 'Je suis' : 'I am a'}</p>
                <div className="space-y-4 mb-6">
                  {[
                    { value: 'BUYER' as const, icon: Package, label: isFr ? 'Acheteur' : 'Buyer', desc: isFr ? 'Je veux rejoindre des groupes d\'achat' : 'I want to join purchasing pools' },
                    { value: 'SUPPLIER' as const, icon: Building2, label: isFr ? 'Fournisseur' : 'Supplier', desc: isFr ? 'Je veux créer des groupes et vendre' : 'I want to create pools and sell' },
                  ].map((option) => (
                    <button key={option.value} onClick={() => setRole(option.value)}
                      className={`w-full flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${role === option.value ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}>
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${role === option.value ? 'bg-brand-100' : 'bg-slate-100'}`}>
                        <option.icon className={role === option.value ? 'text-brand-600' : 'text-slate-500'} size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900">{option.label}</p>
                          {role === option.value && <span className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center"><Check size={12} className="text-white" /></span>}
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">{option.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mb-6">
                  <label className="label">{isFr ? 'Langue préférée' : 'Preferred language'}</label>
                  <div className="flex gap-3">
                    {(['en', 'fr'] as const).map(l => (
                      <button key={l} onClick={() => setPreferredLocale(l)}
                        className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${preferredLocale === l ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600'}`}>
                        {l === 'en' ? 'English' : 'Français'}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="btn-primary w-full text-base py-3.5">
                  {isFr ? 'Suivant' : 'Next'} <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* Step 2: Personal details */}
            {step === 2 && (
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{isFr ? 'Vos coordonnées' : 'Your details'}</h1>
                <p className="text-slate-500 text-sm mb-6">{isFr ? 'Informations personnelles' : 'Personal account details'}</p>
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="label">{isFr ? 'Nom complet' : 'Full name'}</label>
                    <input type="text" className="input" placeholder={isFr ? 'Jean Dupont' : 'Jane Smith'}
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">{isFr ? 'Adresse courriel' : 'Email address'}</label>
                    <input type="email" className="input" placeholder="you@company.com"
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">{isFr ? 'Mot de passe (min. 8 caractères)' : 'Password (min. 8 characters)'}</label>
                    <input type="password" className="input" placeholder="••••••••"
                      value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                    <p className="text-xs text-slate-400 mt-1">{isFr ? 'Utilisez des majuscules, minuscules, chiffres et symboles' : 'Use a mix of uppercase, lowercase, numbers, and symbols'}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-ghost border border-slate-200">
                    <ArrowLeft size={16} /> {isFr ? 'Retour' : 'Back'}
                  </button>
                  <button onClick={() => setStep(3)} disabled={!form.name || !form.email || form.password.length < 8}
                    className="btn-primary flex-1 text-base py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isFr ? 'Suivant' : 'Next'} <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Organization */}
            {step === 3 && (
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{isFr ? 'Organisation' : 'Organization'}</h1>
                <p className="text-slate-500 text-sm mb-6">{isFr ? 'Informations sur votre entreprise' : 'Your business information'}</p>
                {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">{error}</div>}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="label">{isFr ? 'Nom de l\'entreprise' : 'Business name'}</label>
                    <input type="text" className="input" placeholder={isFr ? 'Entreprise XYZ Inc.' : 'XYZ Company Inc.'}
                      value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">{isFr ? 'Province / Territoire' : 'Province / Territory'}</label>
                    <select className="input" value={form.province} onChange={e => setForm({ ...form, province: e.target.value })}>
                      <option value="">{isFr ? 'Sélectionner…' : 'Select…'}</option>
                      {PROVINCES.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">{isFr ? 'Code postal' : 'Postal code'}</label>
                    <input type="text" className="input" placeholder="A1A 1A1"
                      value={form.postalCode} onChange={e => setForm({ ...form, postalCode: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">{isFr ? 'Téléphone (facultatif)' : 'Phone (optional)'}</label>
                    <input type="tel" className="input" placeholder="+1 (514) 555-0100"
                      value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl text-sm text-slate-600">
                    <p>
                      {isFr ? 'En créant un compte, vous acceptez nos' : 'By creating an account, you agree to our'}{' '}
                      <Link href={`/${locale}/terms`} className="text-brand-600 font-medium hover:underline">{isFr ? 'Conditions d\'utilisation' : 'Terms of Service'}</Link>
                      {' '}{isFr ? 'et notre' : 'and'}{' '}
                      <Link href={`/${locale}/privacy`} className="text-brand-600 font-medium hover:underline">{isFr ? 'Politique de confidentialité' : 'Privacy Policy'}</Link>.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-ghost border border-slate-200">
                    <ArrowLeft size={16} /> {isFr ? 'Retour' : 'Back'}
                  </button>
                  <button onClick={handleSubmit}
                    disabled={loading || !form.businessName || !form.province || !form.postalCode}
                    className="btn-accent flex-1 text-base py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading
                      ? <><Loader2 size={16} className="animate-spin" /> {isFr ? 'Création…' : 'Creating…'}</>
                      : <>{isFr ? 'Créer un compte' : 'Create account'} <ArrowRight size={18} /></>}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                {isFr ? 'Vous avez déjà un compte?' : 'Already have an account?'}{' '}
                <Link href={`/${locale}/auth/login`} className="text-brand-600 font-semibold hover:text-brand-700">
                  {isFr ? 'Se connecter' : 'Sign in'}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
