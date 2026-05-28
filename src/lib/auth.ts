import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/en/auth/login',
    error: '/en/auth/login',
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.businessName = (user as any).businessName
        token.preferredLocale = (user as any).preferredLocale ?? 'en'
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role as string
        ;(session.user as any).businessName = token.businessName as string
        ;(session.user as any).preferredLocale = token.preferredLocale as string
      }
      return session
    },
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        try {
          const parsed = loginSchema.safeParse(credentials)
          if (!parsed.success) return null
          const { email, password } = parsed.data
          const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
          if (!user) return null
          const valid = await bcrypt.compare(password, user.passwordHash)
          if (!valid) return null
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            businessName: user.businessName,
            preferredLocale: user.preferredLocale,
          } as any
        } catch (err) {
          console.error('[AUTH authorize]', err)
          return null
        }
      },
    }),
  ],
})
