import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { createOrGetCustomer } from '@/lib/stripe'
import { sendVerificationEmail } from '@/lib/email'
import { randomBytes } from 'crypto'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Min. 8 characters'),
  name: z.string().min(2),
  businessName: z.string().min(2),
  province: z.string().min(2),
  postalCode: z.string().min(3),
  phone: z.string().optional(),
  role: z.enum(['BUYER', 'SUPPLIER']).default('BUYER'),
  preferredLocale: z.enum(['en', 'fr']).default('en'),
})

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json())
    const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } })
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

    const passwordHash = await bcrypt.hash(data.password, 12)
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        name: data.name,
        businessName: data.businessName,
        province: data.province,
        postalCode: data.postalCode.toUpperCase(),
        phone: data.phone,
        role: data.role,
        preferredLocale: data.preferredLocale,
      },
    })

    try { await createOrGetCustomer({ email: user.email, name: user.name, userId: user.id }) }
    catch (e) { console.error('[STRIPE CUSTOMER]', e) }

    const token = randomBytes(32).toString('hex')
    await prisma.verificationToken.create({
      data: { identifier: user.email, token, expires: new Date(Date.now() + 86400000), userId: user.id },
    })
    await sendVerificationEmail({ to: user.email, name: user.name, token, locale: data.preferredLocale })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (err.name === 'ZodError') return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    console.error('[REGISTER]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
