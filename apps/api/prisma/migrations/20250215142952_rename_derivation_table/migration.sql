/*
  Warnings:

  - You are about to drop the `DerivationToComplete` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DerivationToComplete" DROP CONSTRAINT "DerivationToComplete_userId_fkey";

-- DropTable
DROP TABLE "DerivationToComplete";

-- CreateTable
CREATE TABLE "Derivation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Derivation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Derivation" ADD CONSTRAINT "Derivation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
