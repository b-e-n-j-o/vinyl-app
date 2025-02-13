import { PrismaClient, Prisma } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

// Configuration de Prisma avec des niveaux de log spécifiques
const prismaClientOptions: Prisma.PrismaClientOptions = {
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' },
  ] as Prisma.LogDefinition[],
}

// Création de l'instance Prisma avec nos options
const prisma = global.prisma || new PrismaClient(prismaClientOptions)

// Configuration des écouteurs d'événements pour le logging
prisma.$on('query', (e) => {
  console.log('Prisma Query:', {
    query: e.query,
    params: e.params,
    duration: e.duration,
    timestamp: e.timestamp
  })
})

prisma.$on('error', (e) => {
  console.error('Prisma Error:', e)
})

prisma.$on('info', (e) => {
  console.info('Prisma Info:', e)
})

prisma.$on('warn', (e) => {
  console.warn('Prisma Warning:', e)
})

// Logging des informations de configuration au démarrage
console.log('Initializing Prisma Client...')
console.log('Environment:', process.env.NODE_ENV)

// Analyse sécurisée de l'URL de la base de données
if (process.env.DATABASE_URL) {
  try {
    const dbUrl = new URL(process.env.DATABASE_URL)
    // Masquage des informations sensibles pour la sécurité
    console.log('Database Connection Info:', {
      protocol: dbUrl.protocol,
      host: dbUrl.host,
      pathname: dbUrl.pathname,
      params: Array.from(dbUrl.searchParams.keys())
    })
  } catch (error) {
    console.error('Error parsing DATABASE_URL:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.name : 'Unknown type'
    })
  }
} else {
  console.error('DATABASE_URL is not defined')
}

// En développement, on garde l'instance en global
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma
