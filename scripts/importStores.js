import { PrismaClient } from '@prisma/client'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const prisma = new PrismaClient()
const __dirname = dirname(fileURLToPath(import.meta.url))

async function importStores() {
  try {
    // Compter les magasins avant
    const countBefore = await prisma.recordStore.count();
    console.log(`📊 Nombre de magasins avant importation: ${countBefore}`);

    const rawData = await readFile(join(__dirname, '../disquaires_management/paris-transformed.json'), 'utf-8')
    const stores = JSON.parse(rawData)

    for (const store of stores) {
      if (!store.metadata?.name) {
        console.log('⚠️ Store sans nom:', store)
        continue
      }

      try {
        const existingStore = await prisma.recordStore.findFirst({
          where: { address: store.metadata.address }
        })

        if (!existingStore) {
          const storeData = {
            name: store.metadata.name,
            address: store.metadata.address,
            city: store.metadata.city,
            latitude: store.metadata.coordinates.latitude,
            longitude: store.metadata.coordinates.longitude,
            phone: store.metadata.contact.phone,
            website: store.metadata.contact.website,
            rating: store.metadata.business_info.rating,
            reviewCount: store.metadata.business_info.review_count,
            status: store.metadata.business_info.status,
            openingHours: JSON.stringify(store.metadata.business_info.opening_hours)
          }

          console.log('Données à insérer:', storeData)

          await prisma.recordStore.create({
            data: storeData
          })
          console.log(`✅ Importé: ${store.metadata.name}`)
        } else {
          console.log(`⏩ Déjà existant: ${store.metadata.name}`)
        }
      } catch (error) {
        console.error(`❌ Erreur pour le magasin: ${store.metadata?.name}`)
        console.error('Détails de l\'erreur:', error)
      }
    }

    // Compter les magasins après
    const countAfter = await prisma.recordStore.count();
    console.log(`📊 Nombre de magasins après importation: ${countAfter}`);
    console.log(`📈 Nouveaux magasins ajoutés: ${countAfter - countBefore}`);

    console.log('✨ Importation terminée!')
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importStores()