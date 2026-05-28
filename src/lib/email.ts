import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM = 'taddam <noreply@taddam.com>'

async function send(opts: { to: string; subject: string; text: string; html?: string }) {
  if (!resend) { console.log('[EMAIL MOCK]', opts.subject, '->', opts.to); return }
  try { await resend.emails.send({ from: FROM, ...opts }) } catch (e) { console.error('[EMAIL]', e) }
}

export async function sendVerificationEmail(p: { to: string; name: string; token: string; locale: string }) {
  const url = `${process.env.NEXTAUTH_URL}/${p.locale}/auth/verify?token=${p.token}`
  const fr = p.locale === 'fr'
  await send({
    to: p.to,
    subject: fr ? 'Vérifiez votre courriel — taddam' : 'Verify your email — taddam',
    text: fr
      ? `Bonjour ${p.name},\n\nVérifiez votre courriel:\n${url}\n\nExpire dans 24 heures.`
      : `Hi ${p.name},\n\nVerify your email:\n${url}\n\nExpires in 24 hours.`,
    html: `<p style="font-family:sans-serif">${fr ? 'Bonjour' : 'Hi'} ${p.name},</p><p><a href="${url}" style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block">${fr ? 'Vérifier mon courriel' : 'Verify my email'}</a></p>`,
  })
}

export async function sendOrderConfirmationEmail(p: {
  to: string; name: string; locale: string; orderTotal: number; qty: number; productName: string; orderId: string
}) {
  const fr = p.locale === 'fr'
  const total = p.orderTotal.toLocaleString(fr ? 'fr-CA' : 'en-CA', { style: 'currency', currency: 'CAD' })
  await send({
    to: p.to,
    subject: fr ? `Commande confirmée — ${p.productName}` : `Order confirmed — ${p.productName}`,
    text: fr
      ? `Bonjour ${p.name},\n\nCommande confirmée!\nProduit: ${p.productName}\nQuantité: ${p.qty}\nTotal: ${total}\nRéf: ${p.orderId}\n\nVous recevrez un numéro de suivi à l'expédition.`
      : `Hi ${p.name},\n\nOrder confirmed!\nProduct: ${p.productName}\nQty: ${p.qty}\nTotal: ${total}\nRef: ${p.orderId}\n\nTracking number will follow once shipped.`,
  })
}

export async function sendPoolFailedEmail(p: {
  to: string; name: string; locale: string; productName: string; qty: number; total: number
}) {
  const fr = p.locale === 'fr'
  const total = p.total.toLocaleString(fr ? 'fr-CA' : 'en-CA', { style: 'currency', currency: 'CAD' })
  await send({
    to: p.to,
    subject: fr ? `Groupe annulé — ${p.productName}` : `Pool cancelled — ${p.productName}`,
    text: fr
      ? `Bonjour ${p.name},\n\nLe groupe pour "${p.productName}" n'a pas atteint la quantité minimale et a été annulé. Aucun montant prélevé. Réservation annulée: ${p.qty} unités (${total}).`
      : `Hi ${p.name},\n\nThe pool for "${p.productName}" was cancelled (didn't reach minimum). No charge was made. Cancelled commitment: ${p.qty} units (${total}).`,
  })
}

export async function sendPoolFulfilledSupplierEmail(p: {
  to: string; productName: string; orderCount: number; totalUnits: number; totalRevenue: number
}) {
  const rev = p.totalRevenue.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })
  const net = (p.totalRevenue * 0.95).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })
  await send({
    to: p.to,
    subject: `Pool fulfilled — ${p.productName} — ${p.orderCount} orders`,
    text: `Your pool for "${p.productName}" has been fulfilled!\n\nOrders: ${p.orderCount}\nTotal units: ${p.totalUnits}\nGross: ${rev}\nYour net (after 5% fee): ${net}\n\nPlease arrange delivery within 5–7 business days.`,
  })
}

export async function sendPasswordResetEmail(p: { to: string; name: string; token: string; locale: string }) {
  const url = `${process.env.NEXTAUTH_URL}/${p.locale}/auth/reset-password?token=${p.token}`
  const fr = p.locale === 'fr'
  await send({
    to: p.to,
    subject: fr ? 'Réinitialisation du mot de passe — taddam' : 'Reset your password — taddam',
    text: fr
      ? `Bonjour ${p.name},\n\nRéinitialisez votre mot de passe:\n${url}\n\nExpire dans 1 heure.`
      : `Hi ${p.name},\n\nReset your password:\n${url}\n\nExpires in 1 hour.`,
  })
}
