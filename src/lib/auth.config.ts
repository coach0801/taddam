import type { NextAuthConfig } from 'next-auth'

// Edge-compatible auth config — NO Prisma, NO bcryptjs imports.
// Used in middleware to keep the edge function under 1 MB.
// The full auth.ts imports this and adds CredentialsProvider + database.
export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/en/auth/login',
    error: '/en/auth/login',
  },
  session: { strategy: 'jwt' as const },
  callbacks: {
    jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.businessName = (user as any).businessName
        token.preferredLocale = (user as any).preferredLocale ?? 'en'
      }
      return token
    },
    session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role as string
        ;(session.user as any).businessName = token.businessName as string
        ;(session.user as any).preferredLocale = token.preferredLocale as string
      }
      return session
    },
  },
  providers: [],
} satisfies NextAuthConfig
