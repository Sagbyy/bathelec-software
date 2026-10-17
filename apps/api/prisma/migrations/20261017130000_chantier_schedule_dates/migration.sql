ALTER TABLE "Chantier" ADD COLUMN "startDate" TIMESTAMP(3),
ADD COLUMN "endDate" TIMESTAMP(3);

CREATE INDEX "Chantier_startDate_idx" ON "Chantier"("startDate");
