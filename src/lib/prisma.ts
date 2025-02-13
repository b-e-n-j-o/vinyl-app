import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

// Configuration détaillée de Prisma avec logs
const prismaClientOptions = {
  log: [
    { level: 'query', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    },
  },
}

const prisma = global.prisma || new PrismaClient(prismaClientOptions)

// Ajout des écouteurs d'événements pour le logging
prisma.$on('query', (e) => {
  console.log('Query: ', e)
})

prisma.$on('info', (e) => {
  console.log('Info: ', e)
})

prisma.$on('warn', (e) => {
  console.log('Warn: ', e)
})

prisma.$on('error', (e) => {
  console.log('Error: ', e)
})

// Logging de démarrage
console.log('Prisma Client initialization...')
console.log('Environment:', process.env.NODE_ENV)
console.log('Database URL structure check:')
try {
  const dbUrl = process.env.DATABASE_URL || ''
  const maskedUrl = dbUrl.replace(/:[^@]*@/, ':****@')
  console.log('Database URL (masked):', maskedUrl)
  
  // Analyse de l'URL pour vérifier sa structure
  const urlParts = new URL(dbUrl)
  console.log('Protocol:', urlParts.protocol)
  console.log('Username:', urlParts.username)
  console.log('Host:', urlParts.host)
  console.log('Pathname:', urlParts.pathname)
  console.log('Search params:', urlParts.searchParams.toString())
} catch (error) {
  console.error('Error parsing DATABASE_URL:', error)
}

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma
