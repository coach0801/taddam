import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { z } from 'zod'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supplier = await prisma.supplier.findUnique({ where: { userId: (session.user as any).id } })
  if (!supplier) return NextResponse.json({ skus: [] })
  const skus = await prisma.sKU.findMany({ where: { supplierId: supplier.id }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ skus })
}

const skuSchema = z.object({
  nameEn: z.string().min(2), nameFr: z.string().min(2),
  descEn: z.string().optional(), descFr: z.string().optional(),
  category: z.string(), unit: z.string().default('unit'),
  soloPrice: z.number().positive(), minOrderQty: z.number().int().positive().default(1),
  imageUrl: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supplier = await prisma.supplier.findUnique({ where: { userId: (session.user as any).id } })
  if (!supplier?.approved) return NextResponse.json({ error: 'Supplier not approved' }, { status: 403 })

  const parsed = skuSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const sku = await prisma.sKU.create({ data: { ...parsed.data, supplierId: supplier.id, imageUrl: parsed.data.imageUrl || undefined } })
  return NextResponse.json({ sku }, { status: 201 })
}
