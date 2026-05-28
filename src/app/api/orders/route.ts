import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { pool: { include: { sku: true, supplier: { select: { companyName: true } } } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ orders })
}
