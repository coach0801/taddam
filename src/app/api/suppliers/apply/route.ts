import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { createConnectExpressAccount, createConnectOnboardingLink } from '@/lib/stripe'
import { z } from 'zod'

const schema = z.object({
  companyName: z.string().min(2),
  taxNumber: z.string().min(9),
  businessType: z.string().default('corporation'),
  website: z.string().optional(),
  description: z.string().optional(),
  locale: z.enum(['en', 'fr']).default('en'),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  let connectAccountId: string | undefined
  let onboardingUrl: string | null = null

  try {
    const account = await createConnectExpressAccount(user.email)
    connectAccountId = account.id
    const link = await createConnectOnboardingLink(account.id, parsed.data.locale)
    onboardingUrl = link.url
  } catch (e) { console.error('[STRIPE CONNECT]', e) }

  const supplier = await prisma.supplier.upsert({
    where: { userId },
    create: { userId, companyName: parsed.data.companyName, taxNumber: parsed.data.taxNumber, businessType: parsed.data.businessType, website: parsed.data.website, description: parsed.data.description, stripeConnectId: connectAccountId },
    update: { companyName: parsed.data.companyName, taxNumber: parsed.data.taxNumber, businessType: parsed.data.businessType, website: parsed.data.website, description: parsed.data.description, stripeConnectId: connectAccountId ?? undefined },
  })

  await prisma.user.update({ where: { id: userId }, data: { role: 'SUPPLIER' } })

  return NextResponse.json({ supplier, onboardingUrl })
}
