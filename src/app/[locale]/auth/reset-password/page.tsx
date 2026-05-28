'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { type Locale } from '@/lib/i18n'
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react'

function ResetContent({ locale }: { locale: Locale }) {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const fr = locale === 'fr'
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState<'form' | 'success' | 'error'>('form')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setErrorMsg(fr ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setErrorMsg(fr ? 'Minimum 8 caractères.' : 'Minimum 8 characters.')
      return
    }
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (data.success) setState('success')
      else setState('error')
    } catch {
      setState('error')
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 max-w-md w-full">
      <Link href={`/${locale}`} className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center">
          <span className="text-white font-black text-xl leading-none">t</span>
        </div>
        <span className="text-2xl font-black text-brand-800 tracking-tight">taddam</span>
      </Link>

      {state === 'form' && (
        <>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{fr ? 'Nouveau mot de passe' : 'New password'}</h1>
          <p className="text-slate-500 text-sm mb-6">{fr ? 'Choisissez un mot de passe sécurisé.' : 'Choose a secure password.'}</p>
          {errorMsg && <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">{errorMsg}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">{fr ? 'Nouveau mot de passe' : 'New password'}</label>
              <input type="password" className="input" placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)} required minLength={8} />
            </div>
            <div>
              <label className="label">{fr ? 'Confirmer le mot de passe' : 'Confirm password'}</label>
              <input type="password" className="input" placeholder="••••••••" value={confirm}
                onChange={e => setConfirm(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
              {loading ? <><Loader2 size={16} className="animate-spin" /></> : <>{fr ? 'Réinitialiser' : 'Reset password'} <ArrowRight size={18} /></>}
            </button>
          </form>
        </>
      )}

      {state === 'success' && (
        <div className="text-center">
          <CheckCircle2 size={48} className="text-success-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{fr ? 'Mot de passe réinitialisé!' : 'Password reset!'}</h1>
          <p className="text-slate-500 mb-6">{fr ? 'Vous pouvez maintenant vous connecter.' : 'You can now sign in with your new password.'}</p>
          <Link href={`/${locale}/auth/login`} className="btn-primary">{fr ? 'Se connecter' : 'Sign in'}</Link>
        </div>
      )}

      {state === 'error' && (
        <div className="text-center">
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{fr ? 'Lien expiré' : 'Link expired'}</h1>
          <p className="text-slate-500 mb-6">{fr ? 'Ce lien est expiré ou invalide.' : 'This reset link has expired or is invalid.'}</p>
          <Link href={`/${locale}/auth/forgot-password`} className="btn-primary">{fr ? 'Demander un nouveau lien' : 'Request new link'}</Link>
        </div>
      )}
    </div>
  )
}

export default function ResetPasswordPage({ params }: { params: { locale: Locale } }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <Suspense fallback={<Loader2 size={48} className="animate-spin text-brand-600" />}>
        <ResetContent locale={params.locale} />
      </Suspense>
    </div>
  )
}
