/*
  Warnings:

  - You are about to drop the column `customSource` on the `VinylPost` table. All the data in the column will be lost.
  - You are about to drop the column `sourceType` on the `VinylPost` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `VinylPost` table. All the data in the column will be lost.
  - You are about to drop the column `customSource` on the `VinylShare` table. All the data in the column will be lost.
  - You are about to drop the column `sourceType` on the `VinylShare` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `VinylShare` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RecordStore" ADD COLUMN "lastInventoryUpdate" DATETIME;
ALTER TABLE "RecordStore" ADD COLUMN "rating" REAL;
ALTER TABLE "RecordStore" ADD COLUMN "reviewCount" INTEGER;

-- CreateTable
CREATE TABLE "StoreVinyl" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" REAL,
    "condition" TEXT,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "storeId" TEXT NOT NULL,
    "vinylId" TEXT NOT NULL,
    CONSTRAINT "StoreVinyl_vinylId_fkey" FOREIGN KEY ("vinylId") REFERENCES "VinylPost" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StoreVinyl_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "RecordStore" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VinylDig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "comment" TEXT,
    "diggedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "storeId" TEXT NOT NULL,
    "vinylId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "VinylDig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VinylDig_vinylId_fkey" FOREIGN KEY ("vinylId") REFERENCES "VinylPost" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VinylDig_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "RecordStore" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VinylPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "imageUrl" TEXT,
    "year" INTEGER,
    "genres" TEXT NOT NULL,
    "label" TEXT,
    "discogsId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VinylPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_VinylPost" ("artist", "createdAt", "discogsId", "genres", "id", "imageUrl", "label", "title", "userId", "year") SELECT "artist", "createdAt", "discogsId", "genres", "id", "imageUrl", "label", "title", "userId", "year" FROM "VinylPost";
DROP TABLE "VinylPost";
ALTER TABLE "new_VinylPost" RENAME TO "VinylPost";
CREATE INDEX "VinylPost_userId_idx" ON "VinylPost"("userId");
CREATE INDEX "VinylPost_discogsId_idx" ON "VinylPost"("discogsId");
CREATE TABLE "new_VinylShare" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "comment" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "vinylId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "VinylShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VinylShare_vinylId_fkey" FOREIGN KEY ("vinylId") REFERENCES "VinylPost" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_VinylShare" ("comment", "createdAt", "id", "updatedAt", "userId", "vinylId") SELECT "comment", "createdAt", "id", "updatedAt", "userId", "vinylId" FROM "VinylShare";
DROP TABLE "VinylShare";
ALTER TABLE "new_VinylShare" RENAME TO "VinylShare";
CREATE INDEX "VinylShare_vinylId_idx" ON "VinylShare"("vinylId");
CREATE INDEX "VinylShare_userId_idx" ON "VinylShare"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "StoreVinyl_vinylId_idx" ON "StoreVinyl"("vinylId");

-- CreateIndex
CREATE INDEX "StoreVinyl_storeId_idx" ON "StoreVinyl"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "StoreVinyl_storeId_vinylId_key" ON "StoreVinyl"("storeId", "vinylId");

-- CreateIndex
CREATE INDEX "VinylDig_userId_idx" ON "VinylDig"("userId");

-- CreateIndex
CREATE INDEX "VinylDig_vinylId_idx" ON "VinylDig"("vinylId");

-- CreateIndex
CREATE INDEX "VinylDig_storeId_idx" ON "VinylDig"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "VinylDig_userId_vinylId_storeId_key" ON "VinylDig"("userId", "vinylId", "storeId");
