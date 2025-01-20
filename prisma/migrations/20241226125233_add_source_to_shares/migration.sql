-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VinylShare" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "comment" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL DEFAULT 'COLLECTION',
    "storeId" TEXT,
    "customSource" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "vinylId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "VinylShare_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "RecordStore" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "VinylShare_vinylId_fkey" FOREIGN KEY ("vinylId") REFERENCES "VinylPost" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VinylShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_VinylShare" ("comment", "createdAt", "id", "updatedAt", "userId", "vinylId") SELECT "comment", "createdAt", "id", "updatedAt", "userId", "vinylId" FROM "VinylShare";
DROP TABLE "VinylShare";
ALTER TABLE "new_VinylShare" RENAME TO "VinylShare";
CREATE INDEX "VinylShare_vinylId_idx" ON "VinylShare"("vinylId");
CREATE INDEX "VinylShare_userId_idx" ON "VinylShare"("userId");
CREATE INDEX "VinylShare_storeId_idx" ON "VinylShare"("storeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
