import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const pool = await prisma.pool.findUnique({
    where: { id: params.id },
    include: {
      sku: true,
      supplier: { select: { companyName: true, approved: true } },
      _count: { select: { commitments: { where: { status: { not: 'CANCELLED' } } } } },
    },
  })
  if (!pool) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ pool })
}
