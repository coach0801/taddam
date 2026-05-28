import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { randomBytes } from 'crypto'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const { email, locale = 'en' } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (user) {
    const token = randomBytes(32).toString('hex')
    await prisma.verificationToken.create({
      data: { identifier: `reset:${user.email}`, token, expires: new Date(Date.now() + 3600000), userId: user.id },
    })
    await sendPasswordResetEmail({ to: user.email, name: user.name, token, locale })
  }
  return NextResponse.json({ success: true })
}
