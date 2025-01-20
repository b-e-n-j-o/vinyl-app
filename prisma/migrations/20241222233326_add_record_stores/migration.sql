-- CreateTable
CREATE TABLE "RecordStore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "phone" TEXT,
    "website" TEXT,
    "rating" REAL,
    "reviewCount" INTEGER,
    "status" TEXT NOT NULL,
    "openingHours" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastInventoryUpdate" DATETIME
);

-- CreateTable
CREATE TABLE "StoreVinyl" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" REAL,
    "condition" TEXT,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "storeId" TEXT NOT NULL,
    "vinylId" TEXT NOT NULL,
    CONSTRAINT "StoreVinyl_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "RecordStore" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StoreVinyl_vinylId_fkey" FOREIGN KEY ("vinylId") REFERENCES "VinylPost" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VinylDig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "comment" TEXT,
    "diggedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "storeId" TEXT NOT NULL,
    "vinylId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "VinylDig_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "RecordStore" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VinylDig_vinylId_fkey" FOREIGN KEY ("vinylId") REFERENCES "VinylPost" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VinylDig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "RecordStore_city_idx" ON "RecordStore"("city");

-- CreateIndex
CREATE INDEX "StoreVinyl_storeId_idx" ON "StoreVinyl"("storeId");

-- CreateIndex
CREATE INDEX "StoreVinyl_vinylId_idx" ON "StoreVinyl"("vinylId");

-- CreateIndex
CREATE UNIQUE INDEX "StoreVinyl_storeId_vinylId_key" ON "StoreVinyl"("storeId", "vinylId");

-- CreateIndex
CREATE INDEX "VinylDig_storeId_idx" ON "VinylDig"("storeId");

-- CreateIndex
CREATE INDEX "VinylDig_vinylId_idx" ON "VinylDig"("vinylId");

-- CreateIndex
CREATE INDEX "VinylDig_userId_idx" ON "VinylDig"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VinylDig_userId_vinylId_storeId_key" ON "VinylDig"("userId", "vinylId", "storeId");
