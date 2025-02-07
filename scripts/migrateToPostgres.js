// scripts/migrateToPostgres.js
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin vers les fichiers schema
const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
const schemaBackupPath = path.join(__dirname, '../prisma/schema.prisma.backup');
const originalSchema = fs.readFileSync(schemaPath, 'utf-8');
fs.writeFileSync(schemaBackupPath, originalSchema);

// Fonction pour modifier temporairement le schema
async function withCustomSchema(provider, url, operation) {
  const temporarySchema = originalSchema.replace(
    /provider = ".*"/,
    `provider = "${provider}"`
  ).replace(
    /url *= *".*"/,
    `url = "${url}"`
  );
  
  fs.writeFileSync(schemaPath, temporarySchema);
  
  // Forcer la régénération du client Prisma
  const prisma = new PrismaClient();
  
  try {
    return await operation(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

async function migrateData() {
  try {
    console.log('🚀 Début de la migration...\n');

    // Lecture des données depuis SQLite
    console.log('📖 Lecture des données depuis SQLite...');
    const sourceData = await withCustomSchema(
      'sqlite',
      'file:./dev.db',
      async (sqlitePrisma) => {
        const users = await sqlitePrisma.user.findMany();
        console.log(`📝 ${users.length} utilisateurs trouvés`);

        const accounts = await sqlitePrisma.account.findMany();
        console.log(`📝 ${accounts.length} comptes trouvés`);

        const sessions = await sqlitePrisma.session.findMany();
        console.log(`📝 ${sessions.length} sessions trouvées`);

        const follows = await sqlitePrisma.follows.findMany();
        console.log(`📝 ${follows.length} follows trouvés`);

        const stores = await sqlitePrisma.recordStore.findMany();
        console.log(`📝 ${stores.length} magasins trouvés`);

        const vinylsPosted = await sqlitePrisma.vinylPosted.findMany();
        console.log(`📝 ${vinylsPosted.length} vinyles postés trouvés`);

        const vinylsStored = await sqlitePrisma.vinylStored.findMany();
        console.log(`📝 ${vinylsStored.length} vinyles en stock trouvés`);

        return {
          users,
          accounts,
          sessions,
          follows,
          stores,
          vinylsPosted,
          vinylsStored
        };
      }
    );

    // Écriture des données dans PostgreSQL
    console.log('\n📝 Écriture des données dans PostgreSQL...');
    await withCustomSchema(
      'postgresql',
      process.env.DATABASE_URL,
      async (postgresPrisma) => {
        // Migration des utilisateurs
        console.log('\n👤 Migration des utilisateurs...');
        for (const user of sourceData.users) {
          try {
            await postgresPrisma.user.create({
              data: {
                id: user.id,
                name: user.name,
                email: user.email,
                emailVerified: user.emailVerified,
                image: user.image,
                city: user.city,
                musicGenres: user.musicGenres
              }
            });
          } catch (error) {
            console.error(`❌ Erreur lors de la migration de l'utilisateur ${user.email}:`, error.message);
          }
        }
        console.log(`✅ ${sourceData.users.length} utilisateurs migrés`);

        // Migration des comptes
        console.log('\n🔑 Migration des comptes...');
        for (const account of sourceData.accounts) {
          try {
            await postgresPrisma.account.create({
              data: {
                id: account.id,
                userId: account.userId,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state
              }
            });
          } catch (error) {
            console.error(`❌ Erreur lors de la migration du compte ${account.id}:`, error.message);
          }
        }
        console.log(`✅ ${sourceData.accounts.length} comptes migrés`);

        // Migration des sessions
        console.log('\n🔐 Migration des sessions...');
        for (const session of sourceData.sessions) {
          try {
            await postgresPrisma.session.create({
              data: {
                id: session.id,
                sessionToken: session.sessionToken,
                userId: session.userId,
                expires: session.expires
              }
            });
          } catch (error) {
            console.error(`❌ Erreur lors de la migration de la session ${session.id}:`, error.message);
          }
        }
        console.log(`✅ ${sourceData.sessions.length} sessions migrées`);

        // Migration des follows
        console.log('\n🤝 Migration des follows...');
        for (const follow of sourceData.follows) {
          try {
            await postgresPrisma.follows.create({
              data: {
                followerId: follow.followerId,
                followingId: follow.followingId,
                createdAt: follow.createdAt
              }
            });
          } catch (error) {
            console.error(`❌ Erreur lors de la migration du follow ${follow.followerId} -> ${follow.followingId}:`, error.message);
          }
        }
        console.log(`✅ ${sourceData.follows.length} follows migrés`);

        // Migration des magasins
        console.log('\n🏪 Migration des magasins...');
        for (const store of sourceData.stores) {
          try {
            await postgresPrisma.recordStore.create({
              data: {
                id: store.id,
                name: store.name,
                address: store.address,
                city: store.city,
                latitude: store.latitude,
                longitude: store.longitude,
                phone: store.phone,
                website: store.website,
                rating: store.rating,
                reviewCount: store.reviewCount,
                status: store.status,
                openingHours: store.openingHours,
                createdAt: store.createdAt,
                updatedAt: store.updatedAt,
                lastInventoryUpdate: store.lastInventoryUpdate
              }
            });
          } catch (error) {
            console.error(`❌ Erreur lors de la migration du magasin ${store.name}:`, error.message);
          }
        }
        console.log(`✅ ${sourceData.stores.length} magasins migrés`);

        // Migration des vinyles postés
        console.log('\n💿 Migration des vinyles postés...');
        for (const vinyl of sourceData.vinylsPosted) {
          try {
            await postgresPrisma.vinylPosted.create({
              data: {
                id: vinyl.id,
                title: vinyl.title,
                artist: vinyl.artist,
                imageUrl: vinyl.imageUrl,
                year: vinyl.year,
                genres: vinyl.genres,
                label: vinyl.label,
                discogsId: vinyl.discogsId,
                userId: vinyl.userId,
                comment: vinyl.comment,
                sourceType: vinyl.sourceType,
                storeId: vinyl.storeId,
                customSource: vinyl.customSource,
                createdAt: vinyl.createdAt,
                updatedAt: vinyl.updatedAt
              }
            });
          } catch (error) {
            console.error(`❌ Erreur lors de la migration du vinyle ${vinyl.title}:`, error.message);
          }
        }
        console.log(`✅ ${sourceData.vinylsPosted.length} vinyles postés migrés`);

        // Migration des vinyles stockés
        console.log('\n📦 Migration des vinyles en stock...');
        for (const vinyl of sourceData.vinylsStored) {
          try {
            await postgresPrisma.vinylStored.create({
              data: {
                id: vinyl.id,
                addedAt: vinyl.addedAt,
                price: vinyl.price,
                condition: vinyl.condition,
                inStock: vinyl.inStock,
                storeId: vinyl.storeId,
                vinylId: vinyl.vinylId
              }
            });
          } catch (error) {
            console.error(`❌ Erreur lors de la migration du stock ${vinyl.id}:`, error.message);
          }
        }
        console.log(`✅ ${sourceData.vinylsStored.length} vinyles en stock migrés`);
      }
    );

    console.log('\n✨ Migration terminée avec succès!');
  } catch (error) {
    console.error('\n❌ Erreur fatale pendant la migration:', error);
  } finally {
    // Restauration du schema original
    fs.writeFileSync(schemaPath, originalSchema);
    console.log('\n🔄 Schema original restauré');
  }
}

// Exécution de la migration avec gestion des erreurs
migrateData().catch(error => {
  console.error('Erreur non gérée:', error);
  // Restauration du schema original en cas d'erreur
  fs.writeFileSync(schemaPath, originalSchema);
  console.log('🔄 Schema original restauré après erreur');
  process.exit(1);
});