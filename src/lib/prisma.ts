import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    },
  },
})

// Log pour déboguer
console.log('Database URL:', process.env.DATABASE_URL)
console.log('Environment:', process.env.NODE_ENV)

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma