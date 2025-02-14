// src/app/api/auth/[...nextauth]/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import type { NextAuthOptions } from "next-auth"
import prisma from '@/lib/prisma'
import GoogleProvider from "next-auth/providers/google"

// Utilisez ces imports pour les variables d'environnement dans Next.js 13+
const googleId = process.env.GOOGLE_ID
const googleSecret = process.env.GOOGLE_SECRET
const nextAuthSecret = process.env.NEXTAUTH_SECRET

if (!googleId || !googleSecret || !nextAuthSecret) {
  throw new Error('Variables d\'environnement manquantes pour l\'authentification')
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: googleId,
      clientSecret: googleSecret,
    }),
  ],
  session: {
    strategy: 'database',
  },
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id
        // Log pour debug
        console.log('Session user:', session.user)
      }
      return session
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.uid = user.id
      }
      return token
    },
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith(baseUrl)) return url
      return baseUrl
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: nextAuthSecret,
  debug: process.env.NODE_ENV === 'development',
}

export default authOptions