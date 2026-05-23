-- CreateTable
CREATE TABLE "Market" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Market_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chantier" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "enedisAffaireNumber" TEXT NOT NULL,
    "internalAffaireNumber" TEXT NOT NULL,
    "marketId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chantier_pkey" PRIMARY KEY ("id")
);

-- AlterTable: add chantierId, drop old address fields
ALTER TABLE "Derivation"
    ADD COLUMN "chantierId" INTEGER,
    DROP COLUMN IF EXISTS "address",
    DROP COLUMN IF EXISTS "city",
    DROP COLUMN IF EXISTS "postalCode";

-- CreateIndex
CREATE UNIQUE INDEX "Market_name_key" ON "Market"("name");

-- AddForeignKey
ALTER TABLE "Chantier" ADD CONSTRAINT "Chantier_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Derivation" ADD CONSTRAINT "Derivation_chantierId_fkey" FOREIGN KEY ("chantierId") REFERENCES "Chantier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
