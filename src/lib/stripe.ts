import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder', {
  apiVersion: '2025-01-27.acacia' as any,
  typescript: true,
})

export const PLATFORM_FEE_PCT = 0.05

export async function createPaymentIntent(params: {
  amountCAD: number
  customerId?: string
  metadata: Record<string, string>
}) {
  return stripe.paymentIntents.create({
    amount: Math.round(params.amountCAD * 100),
    currency: 'cad',
    customer: params.customerId,
    capture_method: 'manual',
    metadata: params.metadata,
    automatic_payment_methods: { enabled: true },
  })
}

export async function capturePaymentIntent(id: string) {
  return stripe.paymentIntents.capture(id)
}

export async function cancelPaymentIntent(id: string) {
  return stripe.paymentIntents.cancel(id)
}

export async function createOrGetCustomer(params: {
  email: string
  name: string
  userId: string
}): Promise<string> {
  const user = await import('./db').then(m =>
    m.prisma.user.findUnique({ where: { id: params.userId }, select: { stripeCustomerId: true } })
  )
  if (user?.stripeCustomerId) return user.stripeCustomerId

  const customer = await stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: { userId: params.userId },
  })

  await import('./db').then(m =>
    m.prisma.user.update({ where: { id: params.userId }, data: { stripeCustomerId: customer.id } })
  )

  return customer.id
}

export async function createConnectExpressAccount(email: string) {
  return stripe.accounts.create({
    type: 'express',
    email,
    country: 'CA',
    capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
  })
}

export async function createConnectOnboardingLink(accountId: string, locale: string) {
  const base = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  return stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${base}/${locale}/supplier/onboard?refresh=1`,
    return_url: `${base}/${locale}/supplier/onboard?success=1`,
    type: 'account_onboarding',
  })
}

export async function transferToSupplier(params: {
  amountCAD: number
  connectAccountId: string
  orderId: string
}) {
  return stripe.transfers.create({
    amount: Math.round(params.amountCAD * 100),
    currency: 'cad',
    destination: params.connectAccountId,
    metadata: { orderId: params.orderId },
  })
}
