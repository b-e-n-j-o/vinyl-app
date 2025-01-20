-- CreateEnum n'est pas nécessaire car SQLite ne supporte pas les enums

-- DropIndex et DropTable existants (nettoyage des anciennes tables)
DROP INDEX "StoreVinyl_storeId_vinylId_key";
DROP INDEX "StoreVinyl_vinylId_idx";
DROP INDEX "StoreVinyl_storeId_idx";
DROP INDEX "VinylDig_userId_vinylId_storeId_key";
DROP INDEX "VinylDig_userId_idx";
DROP INDEX "VinylDig_vinylId_idx";
DROP INDEX "VinylDig_storeId_idx";

-- Suppression des anciennes tables
PRAGMA foreign_keys=off;
DROP TABLE "StoreVinyl";
DROP TABLE "VinylDig";
PRAGMA foreign_keys=on;

-- Modifications des tables existantes
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- Mise à jour de RecordStore
CREATE TABLE "new_RecordStore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "phone" TEXT,
    "website" TEXT,
    "status" TEXT NOT NULL,
    "openingHours" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "new_RecordStore" (
    "address", "city", "createdAt", "id", "latitude", 
    "longitude", "name", "openingHours", "phone", 
    "status", "updatedAt", "website"
) 
SELECT 
    "address", "city", "createdAt", "id", "latitude", 
    "longitude", "name", "openingHours", "phone", 
    "status", "updatedAt", "website" 
FROM "RecordStore";

DROP TABLE "RecordStore";
ALTER TABLE "new_RecordStore" RENAME TO "RecordStore";
CREATE INDEX "RecordStore_city_idx" ON "RecordStore"("city");

-- Mise à jour de VinylPost avec les nouveaux champs
CREATE TABLE "new_VinylPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "imageUrl" TEXT,
    "year" INTEGER,
    "genres" TEXT NOT NULL,
    "label" TEXT,
    "discogsId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "storeId" TEXT,
    "customSource" TEXT,
    CONSTRAINT "VinylPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VinylPost_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "RecordStore" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Migration des données avec valeur par défaut pour sourceType
INSERT INTO "new_VinylPost" (
    "artist", "createdAt", "discogsId", "genres", "id", 
    "imageUrl", "label", "title", "userId", "year",
    "sourceType", "storeId", "customSource"
) 
SELECT 
    "artist", "createdAt", "discogsId", "genres", "id", 
    "imageUrl", "label", "title", "userId", "year",
    'COLLECTION', -- Valeur par défaut pour les anciens vinyles
    NULL,         -- Pas de magasin par défaut
    NULL          -- Pas de source personnalisée par défaut
FROM "VinylPost";

DROP TABLE "VinylPost";
ALTER TABLE "new_VinylPost" RENAME TO "VinylPost";

-- Recréation des index
CREATE INDEX "VinylPost_userId_idx" ON "VinylPost"("userId");
CREATE INDEX "VinylPost_storeId_idx" ON "VinylPost"("storeId");
CREATE INDEX "VinylPost_discogsId_idx" ON "VinylPost"("discogsId");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;