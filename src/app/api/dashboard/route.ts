import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id
  const role = (session.user as any).role

  const [orders, activeCommitments] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: { pool: { include: { sku: { select: { nameEn: true, nameFr: true, category: true, soloPrice: true } } } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.poolCommitment.findMany({
      where: { userId, status: 'PENDING' },
      include: { pool: { include: { sku: { select: { nameEn: true, nameFr: true } }, supplier: { select: { companyName: true } } } } },
    }),
  ])

  const totalSavingsCAD = (orders as any[]).reduce((sum: number, o: any) => {
    const soloPrice = o.pool.sku.soloPrice
    return sum + (soloPrice - o.unitPrice) * o.qty
  }, 0)

  let supplierData = null
  if (role === 'SUPPLIER') {
    const supplier = await prisma.supplier.findUnique({ where: { userId } })
    if (supplier) {
      const [activePools, payouts] = await Promise.all([
        prisma.pool.findMany({
          where: { supplierId: supplier.id, status: { in: ['OPEN', 'FILLING', 'FULFILLING'] } },
          include: { sku: { select: { nameEn: true, nameFr: true } }, _count: { select: { commitments: true } } },
          take: 5,
        }),
        prisma.supplierPayout.findMany({
          where: { supplierId: supplier.id },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { order: { include: { pool: { include: { sku: { select: { nameEn: true } } } } } } },
        }),
      ])
      supplierData = { activePools, payouts, supplier }
    }
  }

  return NextResponse.json({
    orders,
    activeCommitments,
    totalSavingsCAD: Math.max(0, totalSavingsCAD),
    stats: {
      totalOrders: orders.length,
      delivered: (orders as any[]).filter((o: any) => o.shipmentStatus === 'DELIVERED').length,
      inTransit: (orders as any[]).filter((o: any) => o.shipmentStatus === 'IN_TRANSIT').length,
      pending: (orders as any[]).filter((o: any) => o.shipmentStatus === 'PENDING').length,
      activeCommitments: activeCommitments.length,
    },
    supplierData,
  })
}
