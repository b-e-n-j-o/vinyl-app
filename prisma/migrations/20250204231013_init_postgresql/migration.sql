-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "city" TEXT,
    "musicGenres" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Follows" (
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follows_pkey" PRIMARY KEY ("followerId","followingId")
);

-- CreateTable
CREATE TABLE "VinylPosted" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "imageUrl" TEXT,
    "year" INTEGER,
    "genres" TEXT NOT NULL,
    "label" TEXT,
    "discogsId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "comment" TEXT,
    "sourceType" TEXT NOT NULL DEFAULT 'COLLECTION',
    "storeId" TEXT,
    "customSource" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VinylPosted_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecordStore" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "phone" TEXT,
    "website" TEXT,
    "rating" DOUBLE PRECISION,
    "reviewCount" INTEGER,
    "status" TEXT NOT NULL,
    "openingHours" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastInventoryUpdate" TIMESTAMP(3),

    CONSTRAINT "RecordStore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VinylStored" (
    "id" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" DOUBLE PRECISION,
    "condition" TEXT,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "storeId" TEXT NOT NULL,
    "vinylId" TEXT NOT NULL,

    CONSTRAINT "VinylStored_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Follows_followerId_idx" ON "Follows"("followerId");

-- CreateIndex
CREATE INDEX "Follows_followingId_idx" ON "Follows"("followingId");

-- CreateIndex
CREATE INDEX "VinylPosted_userId_idx" ON "VinylPosted"("userId");

-- CreateIndex
CREATE INDEX "VinylPosted_discogsId_idx" ON "VinylPosted"("discogsId");

-- CreateIndex
CREATE INDEX "VinylPosted_storeId_idx" ON "VinylPosted"("storeId");

-- CreateIndex
CREATE INDEX "RecordStore_city_idx" ON "RecordStore"("city");

-- CreateIndex
CREATE INDEX "VinylStored_vinylId_idx" ON "VinylStored"("vinylId");

-- CreateIndex
CREATE INDEX "VinylStored_storeId_idx" ON "VinylStored"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "VinylStored_storeId_vinylId_key" ON "VinylStored"("storeId", "vinylId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VinylPosted" ADD CONSTRAINT "VinylPosted_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VinylPosted" ADD CONSTRAINT "VinylPosted_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "RecordStore"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VinylStored" ADD CONSTRAINT "VinylStored_vinylId_fkey" FOREIGN KEY ("vinylId") REFERENCES "VinylPosted"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VinylStored" ADD CONSTRAINT "VinylStored_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "RecordStore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
