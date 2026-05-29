'use client'
import { useState } from 'react'
import Link from 'next/link'
import { type Locale } from '@/lib/i18n'
import { ArrowRight, Loader2, CheckCircle2, ExternalLink } from 'lucide-react'

export default function OnboardContent({ locale }: { locale: Locale }) {
  const fr = locale === 'fr'

  const [step, setStep] = useState<'form' | 'stripe' | 'pending'>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [onboardingUrl, setOnboardingUrl] = useState<string | null>(null)

  const [form, setForm] = useState({
    companyName: '',
    taxNumber: '',
    businessType: 'corporation',
    website: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/suppliers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? (fr ? 'Erreur.' : 'Error.'))
        setLoading(false)
        return
      }
      if (data.onboardingUrl) {
        setOnboardingUrl(data.onboardingUrl)
        setStep('stripe')
      } else {
        setStep('pending')
      }
    } catch {
      setError(fr ? 'Erreur réseau.' : 'Network error.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center">
                <span className="text-white font-black text-lg leading-none">t</span>
              </div>
              <span className="text-xl font-black tracking-tight text-brand-800">taddam</span>
            </Link>
            <Link href={`/${locale}/dashboard`} className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              {fr ? '← Tableau de bord' : '← Dashboard'}
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-16">
        {step === 'form' && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{fr ? 'Devenez fournisseur' : 'Become a Supplier'}</h1>
              <p className="text-slate-500 text-sm">{fr ? 'Postulez pour vendre via le réseau d\'approvisionnement collectif taddam' : 'Apply to sell through taddam\'s collective procurement network'}</p>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">{fr ? 'Nom de l\'entreprise / Raison sociale' : 'Company / Legal name'} <span className="text-red-500">*</span></label>
                <input type="text" className="input" placeholder={fr ? 'XYZ Distribution Inc.' : 'XYZ Distribution Inc.'}
                  value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} required />
              </div>
              <div>
                <label className="label">{fr ? 'Numéro d\'entreprise ARC (NE)' : 'CRA Business Number (BN)'} <span className="text-red-500">*</span></label>
                <input type="text" className="input" placeholder="123456789"
                  value={form.taxNumber} onChange={e => setForm({ ...form, taxNumber: e.target.value })} required minLength={9} />
                <p className="text-xs text-slate-400 mt-1">{fr ? 'Numéro à 9 chiffres de l\'Agence du revenu du Canada' : '9-digit Canada Revenue Agency business number'}</p>
              </div>
              <div>
                <label className="label">{fr ? 'Type d\'entreprise' : 'Business type'}</label>
                <select className="input" value={form.businessType} onChange={e => setForm({ ...form, businessType: e.target.value })}>
                  <option value="corporation">{fr ? 'Société par actions' : 'Corporation'}</option>
                  <option value="sole_proprietor">{fr ? 'Travailleur autonome' : 'Sole proprietor'}</option>
                  <option value="partnership">{fr ? 'Société de personnes' : 'Partnership'}</option>
                </select>
              </div>
              <div>
                <label className="label">{fr ? 'Site web (facultatif)' : 'Website (optional)'}</label>
                <input type="url" className="input" placeholder="https://yourcompany.com"
                  value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
              </div>
              <div>
                <label className="label">{fr ? 'Brève description de ce que vous vendez' : 'Brief description of what you sell'}</label>
                <textarea className="input min-h-24 resize-none" placeholder={fr ? 'Nous distribuons des EPI et fournitures industrielles…' : 'We distribute PPE and industrial supplies…'}
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              <div className="p-4 bg-brand-50 border border-brand-100 rounded-xl text-sm text-brand-700">
                {fr ? 'Après la soumission, vous pourrez connecter votre compte bancaire via Stripe pour recevoir des paiements.' : 'After submission, you\'ll be able to connect your bank account via Stripe to receive payments.'}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                {loading ? <><Loader2 size={16} className="animate-spin" /> {fr ? 'Envoi…' : 'Submitting…'}</> : <>{fr ? 'Soumettre la demande' : 'Submit application'} <ArrowRight size={18} /></>}
              </button>
            </form>
          </div>
        )}

        {step === 'stripe' && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center">
            <CheckCircle2 size={48} className="text-success-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{fr ? 'Demande soumise!' : 'Application submitted!'}</h1>
            <p className="text-slate-500 mb-6">{fr ? 'Dernière étape : connectez votre compte bancaire pour recevoir des paiements.' : 'One more step: connect your bank account to receive payments.'}</p>
            {onboardingUrl && (
              <a href={onboardingUrl} className="btn-primary inline-flex items-center gap-2 py-3 px-8">
                <ExternalLink size={16} />
                {fr ? 'Configurer les virements bancaires via Stripe' : 'Set up bank payouts via Stripe'}
              </a>
            )}
            <p className="text-xs text-slate-400 mt-4">{fr ? 'Vous serez redirigé vers Stripe pour compléter la vérification KYC.' : 'You\'ll be redirected to Stripe to complete KYC verification.'}</p>
            <button onClick={() => setStep('pending')} className="block mt-4 text-sm text-brand-600 hover:underline mx-auto">
              {fr ? 'Configurer plus tard' : 'Set up later'}
            </button>
          </div>
        )}

        {step === 'pending' && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={32} className="text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{fr ? 'Demande soumise' : 'Application submitted'}</h1>
            <p className="text-slate-500 mb-6">{fr ? 'Nous examinons les demandes sous 2 jours ouvrables. Vous serez avisé par courriel.' : 'We review applications within 2 business days. You\'ll be notified by email.'}</p>
            <Link href={`/${locale}/dashboard`} className="btn-primary">
              {fr ? 'Retour au tableau de bord' : 'Back to dashboard'}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
