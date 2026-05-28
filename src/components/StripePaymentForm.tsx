'use client'
import { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Loader2 } from 'lucide-react'

interface Props {
  total: number
  onSuccess: () => void
  onCancel: () => void
  locale: string
}

export default function StripePaymentForm({ total, onSuccess, onCancel, locale }: Props) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fr = locale === 'fr'
  const totalFmt = total.toLocaleString(fr ? 'fr-CA' : 'en-CA', { style: 'currency', currency: 'CAD' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true); setError(null)
    const { error: err } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/${locale}/dashboard?committed=1` },
      redirect: 'if_required',
    })
    if (err) { setError(err.message ?? 'Payment failed'); setLoading(false) } else { onSuccess() }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement />
      {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      <div className="bg-brand-50 rounded-xl p-4 text-sm border border-brand-100">
        <div className="flex justify-between font-semibold text-slate-800">
          <span>{fr ? 'Montant autorisé (non prélevé)' : 'Amount to authorize (not charged yet)'}</span>
          <span className="text-brand-700">{totalFmt}</span>
        </div>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          {fr ? 'Votre carte sera débitée uniquement si le groupe atteint sa quantité cible avant la date limite. Annulable à tout moment avant la clôture.' : 'Your card is only charged if the pool reaches its target before the deadline. Cancellable any time before the pool closes.'}
        </p>
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="btn-ghost flex-1 py-3 border border-slate-200">{fr ? 'Annuler' : 'Cancel'}</button>
        <button type="submit" disabled={loading || !stripe} className="btn-primary flex-1 py-3">
          {loading ? <><Loader2 size={16} className="animate-spin" /> {fr ? 'Traitement…' : 'Processing…'}</> : (fr ? 'Confirmer ma participation' : 'Confirm commitment')}
        </button>
      </div>
    </form>
  )
}
