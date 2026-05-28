import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const status = searchParams.get('status') ?? 'OPEN'
  const region = searchParams.get('region') ?? undefined
  const category = searchParams.get('category') ?? undefined
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20'))

  const where: any = {}
  if (status !== 'all') where.status = status
  if (region) where.region = { contains: region, mode: 'insensitive' }
  if (category) where.sku = { category }

  const [pools, total] = await Promise.all([
    prisma.pool.findMany({
      where,
      include: {
        sku: { select: { nameEn: true, nameFr: true, category: true, unit: true, soloPrice: true, imageUrl: true } },
        supplier: { select: { companyName: true } },
        _count: { select: { commitments: { where: { status: { not: 'CANCELLED' } } } } },
      },
      orderBy: { closesAt: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.pool.count({ where }),
  ])

  const poolsWithPrice = pools.map((pool) => {
    const tiers = (pool.tiers as Array<{ minQty: number; unitPrice: number }>)
    const sorted = [...tiers].sort((a, b) => b.minQty - a.minQty)
    const matchedTier = sorted.find((tier) => pool.committedQty >= tier.minQty) ?? sorted[sorted.length - 1]
    const currentUnitPrice = matchedTier?.unitPrice ?? 0
    return { ...pool, currentUnitPrice }
  })

  return NextResponse.json({ pools: poolsWithPrice, total, page, pages: Math.ceil(total / limit) })
}

const createSchema = z.object({
  skuId: z.string(),
  targetQty: z.number().int().positive(),
  closesAt: z.string(),
  region: z.string(),
  regionFr: z.string().optional(),
  tiers: z.array(z.object({ minQty: z.number().int().positive(), unitPrice: z.number().positive() })).min(1),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user as any
  if (user.role !== 'SUPPLIER' && user.role !== 'ADMIN') return NextResponse.json({ error: 'Suppliers only' }, { status: 403 })

  const parsed = createSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const supplier = await prisma.supplier.findUnique({ where: { userId: user.id } })
  if (!supplier?.approved) return NextResponse.json({ error: 'Account not approved' }, { status: 403 })

  const sku = await prisma.sKU.findFirst({ where: { id: parsed.data.skuId, supplierId: supplier.id } })
  if (!sku) return NextResponse.json({ error: 'SKU not found' }, { status: 404 })

  const pool = await prisma.pool.create({
    data: {
      supplierId: supplier.id,
      skuId: sku.id,
      targetQty: parsed.data.targetQty,
      closesAt: new Date(parsed.data.closesAt),
      region: parsed.data.region,
      regionFr: parsed.data.regionFr,
      tiers: parsed.data.tiers,
    },
    include: { sku: true },
  })

  return NextResponse.json({ pool }, { status: 201 })
}
