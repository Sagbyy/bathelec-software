-- AlterTable
ALTER TABLE "Derivation" ADD COLUMN     "teamId" INTEGER;

-- CreateIndex
CREATE INDEX "Derivation_teamId_idx" ON "Derivation"("teamId");

-- AddForeignKey
ALTER TABLE "Derivation" ADD CONSTRAINT "Derivation_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "UserGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

