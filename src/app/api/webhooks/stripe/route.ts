import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? '')
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object as Stripe.PaymentIntent
      await prisma.poolCommitment.updateMany({ where: { stripePaymentIntentId: pi.id }, data: { status: 'CONFIRMED' } })
    } else if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object as Stripe.PaymentIntent
      await prisma.poolCommitment.updateMany({ where: { stripePaymentIntentId: pi.id }, data: { status: 'CANCELLED' } })
    } else if (event.type === 'account.updated') {
      const account = event.data.object as Stripe.Account
      if (account.charges_enabled) {
        await prisma.supplier.updateMany({ where: { stripeConnectId: account.id }, data: { stripeConnectOnboarded: true } })
      }
    }
  } catch (err) { console.error('[WEBHOOK]', err) }

  return NextResponse.json({ received: true })
}
