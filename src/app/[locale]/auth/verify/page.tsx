'use client'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { type Locale } from '@/lib/i18n'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

function VerifyContent({ locale }: { locale: Locale }) {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading')
  const fr = locale === 'fr'

  useEffect(() => {
    if (!token) { setState('error'); return }
    fetch(`/api/auth/verify?token=${token}`)
      .then(r => r.json())
      .then(d => setState(d.success ? 'success' : 'error'))
      .catch(() => setState('error'))
  }, [token])

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 max-w-md w-full text-center">
      <Link href={`/${locale}`} className="flex items-center justify-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center">
          <span className="text-white font-black text-xl leading-none">t</span>
        </div>
        <span className="text-2xl font-black text-brand-800 tracking-tight">taddam</span>
      </Link>
      {state === 'loading' && <><Loader2 size={48} className="animate-spin text-brand-600 mx-auto mb-4" /><p className="text-slate-500">{fr ? 'Vérification…' : 'Verifying…'}</p></>}
      {state === 'success' && (
        <><CheckCircle2 size={48} className="text-success-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{fr ? 'Courriel vérifié !' : 'Email verified!'}</h1>
        <p className="text-slate-500 mb-6">{fr ? 'Votre compte est activé.' : 'Your account is active. You can now sign in.'}</p>
        <Link href={`/${locale}/auth/login`} className="btn-primary">{fr ? 'Se connecter' : 'Sign in'}</Link></>
      )}
      {state === 'error' && (
        <><XCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{fr ? 'Lien invalide' : 'Invalid link'}</h1>
        <p className="text-slate-500 mb-6">{fr ? 'Ce lien est expiré ou invalide.' : 'This link has expired or is invalid.'}</p>
        <Link href={`/${locale}/auth/register`} className="btn-primary">{fr ? "S'inscrire" : 'Register'}</Link></>
      )}
    </div>
  )
}

export default function VerifyPage({ params }: { params: { locale: Locale } }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <Suspense fallback={<Loader2 size={48} className="animate-spin text-brand-600" />}>
        <VerifyContent locale={params.locale} />
      </Suspense>
    </div>
  )
}
