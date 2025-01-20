// src/app/api/auth/[...nextauth]/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { AuthOptions } from "next-auth"
import prisma from '../../../../../src/lib/prisma'
import GoogleProvider from "next-auth/providers/google"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
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
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: process.env.NODE_ENV === 'development', // Activez ceci en développement
}

export default authOptions