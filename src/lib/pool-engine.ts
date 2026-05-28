import { prisma } from './db'
import { capturePaymentIntent, cancelPaymentIntent, transferToSupplier, PLATFORM_FEE_PCT } from './stripe'
import { sendOrderConfirmationEmail, sendPoolFailedEmail, sendPoolFulfilledSupplierEmail } from './email'

export function getCurrentTierPrice(tiers: Array<{ minQty: number; unitPrice: number }>, qty: number): number {
  const sorted = [...tiers].sort((a, b) => b.minQty - a.minQty)
  const tier = sorted.find(t => qty >= t.minQty)
  return tier?.unitPrice ?? sorted[sorted.length - 1].unitPrice
}

export async function closePools() {
  const now = new Date()
  const expiredPools = await prisma.pool.findMany({
    where: { closesAt: { lte: now }, status: { in: ['OPEN', 'FILLING'] } },
    include: {
      commitments: {
        where: { status: 'PENDING' },
        include: { user: { select: { id: true, email: true, name: true, preferredLocale: true } } },
      },
      sku: true,
      supplier: { include: { user: { select: { email: true } } } },
    },
  })

  const results: any[] = []
  for (const pool of expiredPools) {
    const totalCommitted = pool.commitments.reduce((s: number, c: any) => s + c.qty, 0)
    if (totalCommitted >= pool.targetQty) {
      results.push({ poolId: pool.id, outcome: 'fulfilled', ...(await fulfillPool(pool)) })
    } else {
      results.push({ poolId: pool.id, outcome: 'failed', ...(await failPool(pool)) })
    }
  }
  return results
}

async function fulfillPool(pool: any) {
  await prisma.pool.update({ where: { id: pool.id }, data: { status: 'FULFILLING', closedAt: new Date() } })

  let ordersCreated = 0, totalRevenue = 0, totalUnits = 0

  for (const commitment of pool.commitments) {
    try {
      if (commitment.stripePaymentIntentId) await capturePaymentIntent(commitment.stripePaymentIntentId)

      const order = await prisma.order.create({
        data: {
          commitmentId: commitment.id,
          poolId: pool.id,
          userId: commitment.userId,
          qty: commitment.qty,
          unitPrice: commitment.unitPrice,
          total: commitment.total,
          shipmentStatus: 'PENDING',
        },
      })

      await prisma.poolCommitment.update({ where: { id: commitment.id }, data: { status: 'CONFIRMED' } })

      const supplierAmount = commitment.total * (1 - PLATFORM_FEE_PCT)
      const payout = await prisma.supplierPayout.create({
        data: { orderId: order.id, supplierId: pool.supplierId, amount: supplierAmount, currency: 'CAD', status: 'PENDING' },
      })

      if (pool.supplier.stripeConnectId && pool.supplier.stripeConnectOnboarded) {
        try {
          const transfer = await transferToSupplier({ amountCAD: supplierAmount, connectAccountId: pool.supplier.stripeConnectId, orderId: order.id })
          await prisma.supplierPayout.update({ where: { id: payout.id }, data: { stripeTransferId: transfer.id, status: 'PAID', paidAt: new Date() } })
        } catch (e) { console.error('[TRANSFER]', e) }
      }

      ordersCreated++; totalRevenue += commitment.total; totalUnits += commitment.qty

      await sendOrderConfirmationEmail({
        to: commitment.user.email, name: commitment.user.name, locale: commitment.user.preferredLocale,
        orderTotal: commitment.total, qty: commitment.qty,
        productName: commitment.user.preferredLocale === 'fr' ? pool.sku.nameFr : pool.sku.nameEn,
        orderId: order.id,
      })
    } catch (err) { console.error(`[FULFILL commitment ${commitment.id}]`, err) }
  }

  await prisma.pool.update({ where: { id: pool.id }, data: { status: 'COMPLETED' } })

  if (pool.supplier.user?.email) {
    await sendPoolFulfilledSupplierEmail({ to: pool.supplier.user.email, productName: pool.sku.nameEn, orderCount: ordersCreated, totalUnits, totalRevenue })
  }

  return { ordersCreated, totalRevenue }
}

async function failPool(pool: any) {
  await prisma.pool.update({ where: { id: pool.id }, data: { status: 'FAILED', closedAt: new Date() } })
  let cancelled = 0
  for (const commitment of pool.commitments) {
    try {
      if (commitment.stripePaymentIntentId) await cancelPaymentIntent(commitment.stripePaymentIntentId)
      await prisma.poolCommitment.update({ where: { id: commitment.id }, data: { status: 'CANCELLED' } })
      await sendPoolFailedEmail({
        to: commitment.user.email, name: commitment.user.name, locale: commitment.user.preferredLocale,
        productName: commitment.user.preferredLocale === 'fr' ? pool.sku.nameFr : pool.sku.nameEn,
        qty: commitment.qty, total: commitment.total,
      })
      cancelled++
    } catch (err) { console.error(`[FAIL commitment ${commitment.id}]`, err) }
  }
  return { commitmentsCancelled: cancelled }
}
