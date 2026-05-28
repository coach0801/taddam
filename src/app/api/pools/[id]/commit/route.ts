import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { createPaymentIntent, createOrGetCustomer } from '@/lib/stripe'
import { getCurrentTierPrice } from '@/lib/pool-engine'
import { z } from 'zod'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id

  const { qty } = z.object({ qty: z.number().int().min(1) }).parse(await req.json())

  const pool = await prisma.pool.findUnique({ where: { id: params.id }, include: { sku: true } })
  if (!pool) return NextResponse.json({ error: 'Pool not found' }, { status: 404 })
  if (!['OPEN', 'FILLING'].includes(pool.status)) return NextResponse.json({ error: 'Pool closed' }, { status: 409 })
  if (pool.closesAt < new Date()) return NextResponse.json({ error: 'Pool expired' }, { status: 409 })

  const existing = await prisma.poolCommitment.findFirst({ where: { poolId: pool.id, userId, status: { not: 'CANCELLED' } } })
  if (existing) return NextResponse.json({ error: 'Already committed' }, { status: 409 })

  const tiers = pool.tiers as Array<{ minQty: number; unitPrice: number }>
  const unitPrice = getCurrentTierPrice(tiers, pool.committedQty + qty)
  const total = unitPrice * qty

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } })
  const customerId = await createOrGetCustomer({ email: user!.email, name: user!.name, userId })

  const pi = await createPaymentIntent({ amountCAD: total, customerId, metadata: { poolId: pool.id, userId, qty: qty.toString() } })

  const commitment = await prisma.poolCommitment.create({
    data: { poolId: pool.id, userId, qty, unitPrice, total, stripePaymentIntentId: pi.id, stripeClientSecret: pi.client_secret },
  })

  await prisma.pool.update({
    where: { id: pool.id },
    data: { committedQty: { increment: qty }, participantCount: { increment: 1 }, status: pool.committedQty + qty >= pool.targetQty ? 'FILLING' : 'OPEN' },
  })

  return NextResponse.json({ commitmentId: commitment.id, clientSecret: pi.client_secret, unitPrice, total })
}
