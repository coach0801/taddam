import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { token, password } = await req.json()
  if (!token || !password || password.length < 8) return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  const record = await prisma.verificationToken.findUnique({ where: { token } })
  if (!record || record.expires < new Date() || !record.identifier.startsWith('reset:')) {
    return NextResponse.json({ error: 'Token expired' }, { status: 400 })
  }
  const email = record.identifier.replace('reset:', '')
  await prisma.user.update({ where: { email }, data: { passwordHash: await bcrypt.hash(password, 12) } })
  await prisma.verificationToken.delete({ where: { token } })
  return NextResponse.json({ success: true })
}
