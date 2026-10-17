ALTER TABLE "Derivation" ADD COLUMN "folio" TEXT;

CREATE UNIQUE INDEX "Derivation_folio_key" ON "Derivation"("folio");
