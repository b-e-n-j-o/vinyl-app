import { PrismaClient } from '@prisma/client'

// Déclaration pour le support de l'instance globale en développement
declare global {
  var prisma: PrismaClient | undefined
}

// Configuration simple de Prisma avec logging de base
const prisma = global.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

// Logging des informations de configuration au démarrage
console.log('Initializing Prisma Client...')
console.log('Environment:', process.env.NODE_ENV)

// Analyse et logging sécurisé de l'URL de la base de données
if (process.env.DATABASE_URL) {
  try {
    const dbUrl = new URL(process.env.DATABASE_URL)
    // On masque les informations sensibles tout en gardant la structure pour le débogage
    console.log('Database Connection Info:', {
      protocol: dbUrl.protocol,
      host: dbUrl.host,
      pathname: dbUrl.pathname,
      searchParams: Array.from(dbUrl.searchParams.keys())
    })
  } catch (error) {
    // Logging structuré de l'erreur pour un meilleur débogage
    console.error('Error analyzing DATABASE_URL:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.name : 'Unknown type'
    })
  }
} else {
  console.error('DATABASE_URL environment variable is not defined')
}

// En développement, on conserve l'instance en global
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma
