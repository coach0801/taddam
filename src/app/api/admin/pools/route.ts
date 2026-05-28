import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const [activePools, recentOrders, userCount, pendingPayouts] = await Promise.all([
    prisma.pool.findMany({
      where: { status: { in: ['OPEN', 'FILLING', 'FULFILLING'] } },
      include: { sku: { select: { nameEn: true, category: true } }, supplier: { select: { companyName: true } }, _count: { select: { commitments: true } } },
      orderBy: { closesAt: 'asc' },
      take: 20,
    }),
    prisma.order.findMany({
      include: { user: { select: { businessName: true } }, pool: { include: { sku: { select: { nameEn: true } } } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.user.count(),
    prisma.supplierPayout.aggregate({ _sum: { amount: true }, where: { status: 'PENDING' } }),
  ])

  const activePools2 = await prisma.pool.count({ where: { status: { in: ['OPEN', 'FILLING'] } } })
  const totalOrders = await prisma.order.count()

  return NextResponse.json({
    activePools,
    recentOrders,
    stats: { totalUsers: userCount, activePools: activePools2, totalOrders, pendingPayoutsCAD: pendingPayouts._sum.amount ?? 0 },
  })
}
