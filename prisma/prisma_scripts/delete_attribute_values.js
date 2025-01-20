import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function clearVinylShares() {
  try {
    await prisma.vinylShare.deleteMany({})
    console.log('Tous les VinylShare ont été supprimés avec succès')
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearVinylShares()