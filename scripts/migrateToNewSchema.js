import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateData() {
  try {
    console.log('🚀 Début de la migration des données...')

    // 1. Récupérer tous les VinylShare avec leurs VinylPost associés
    const shares = await prisma.vinylShare.findMany({
      include: {
        vinyl: true,
        user: true,
      }
    })
    console.log(`📦 ${shares.length} partages trouvés à migrer`)

    // 2. Pour chaque partage, créer un nouveau VinylPosted
    for (const share of shares) {
      try {
        const newVinyl = await prisma.vinylPosted.upsert({
          where: { id: share.vinylId },
          update: {},
          create: {
            id: share.vinylId, // Utiliser le même ID que le VinylPost original
            title: share.vinyl.title,
            artist: share.vinyl.artist,
            imageUrl: share.vinyl.imageUrl,
            year: share.vinyl.year,
            genres: share.vinyl.genres,
            label: share.vinyl.label,
            discogsId: share.vinyl.discogsId,
            userId: share.userId,
            comment: share.comment,
            sourceType: share.sourceType,
            storeId: share.storeId,
            customSource: share.customSource,
            createdAt: share.createdAt,
            updatedAt: share.updatedAt
          }
        })
        console.log(`✅ Migré: ${share.vinyl.title} par ${share.vinyl.artist}`)
      } catch (error) {
        console.error(`❌ Erreur lors de la migration du vinyle ${share.vinyl.title}:`, error)
      }
    }

    // 3. Migrer les StoreVinyl vers VinylStored
    const storeVinyls = await prisma.storeVinyl.findMany({
      include: {
        VinylPost: true,
      }
    })
    console.log(`📦 ${storeVinyls.length} vinyles en magasin trouvés à migrer`)

    for (const storeVinyl of storeVinyls) {
      try {
        await prisma.vinylStored.create({
          data: {
            id: storeVinyl.id,
            addedAt: storeVinyl.addedAt,
            price: storeVinyl.price,
            condition: storeVinyl.condition,
            inStock: storeVinyl.inStock,
            storeId: storeVinyl.storeId,
            vinylId: storeVinyl.vinylId,
          }
        })
        console.log(`✅ Migré stock: ${storeVinyl.VinylPost.title}`)
      } catch (error) {
        console.error(`❌ Erreur lors de la migration du stock ${storeVinyl.id}:`, error)
      }
    }

    console.log('✨ Migration terminée avec succès!')
  } catch (error) {
    console.error('❌ Erreur générale lors de la migration:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter la migration
migrateData()