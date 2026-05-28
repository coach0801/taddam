import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { cancelPaymentIntent } from '@/lib/stripe'

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id

  const commitment = await prisma.poolCommitment.findFirst({ where: { poolId: params.id, userId, status: 'PENDING' } })
  if (!commitment) return NextResponse.json({ error: 'No active commitment' }, { status: 404 })

  if (commitment.stripePaymentIntentId) await cancelPaymentIntent(commitment.stripePaymentIntentId)
  await prisma.poolCommitment.update({ where: { id: commitment.id }, data: { status: 'CANCELLED' } })
  await prisma.pool.update({ where: { id: params.id }, data: { committedQty: { decrement: commitment.qty }, participantCount: { decrement: 1 } } })

  return NextResponse.json({ success: true })
}
