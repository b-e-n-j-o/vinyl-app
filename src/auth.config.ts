// src/auth.config.ts
import { AuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import prisma from './lib/prisma'

declare module "next-auth" {
 interface Session {
   user: {
     id: string;
     name?: string | null;
     email?: string | null;
     image?: string | null;
   }
 }
}

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
       console.log('Session callback - User:', user)
       console.log('Session callback - Session:', session)
     }
     return session
   },
   jwt: async ({ token, user }) => {
     if (user) {
       token.uid = user.id
     }
     return token
   },
   redirect: async () => {
     return '/'
   }
 },
 pages: {
   signIn: '/auth/signin',
 },
 secret: process.env.NEXTAUTH_SECRET,
 debug: process.env.NODE_ENV === 'development',
}

export default authOptions