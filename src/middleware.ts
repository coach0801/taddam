import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'
import { NextResponse } from 'next/server'

// Use lightweight auth config (no Prisma/bcryptjs) to keep edge bundle < 1 MB
const { auth } = NextAuth(authConfig)

const PROTECTED_PATHS = ['/dashboard', '/orders', '/pools/create', '/supplier', '/admin']

export default auth((req: any) => {
  const { pathname } = req.nextUrl
  const segments = pathname.split('/')
  const locale = segments[1] ?? 'en'

  const isProtected = PROTECTED_PATHS.some(p => pathname.includes(p))
  if (isProtected && !req.auth) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login?from=${encodeURIComponent(pathname)}`, req.url))
  }

  if (pathname.includes('/admin') && (req.auth?.user as any)?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
