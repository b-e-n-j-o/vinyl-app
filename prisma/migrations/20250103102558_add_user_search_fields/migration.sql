-- This is an empty migration.-- RedefineTables
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "emailVerified" DATETIME,
    "city" TEXT DEFAULT 'Paris',
    "musicGenres" TEXT DEFAULT '[]',
    CONSTRAINT "User_email_key" UNIQUE ("email")
);

INSERT INTO "new_User" ("id", "email", "name", "image", "emailVerified") 
SELECT "id", "email", "name", "image", "emailVerified" FROM "User";

DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE INDEX "User_city_idx" ON "User"("city");

PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;