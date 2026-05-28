import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const suppliers = await prisma.supplier.findMany({
    include: { user: { select: { email: true, name: true, businessName: true, createdAt: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ suppliers })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { supplierId, approved } = await req.json()
  const supplier = await prisma.supplier.update({
    where: { id: supplierId },
    data: { approved, approvedAt: approved ? new Date() : null },
  })
  return NextResponse.json({ supplier })
}
