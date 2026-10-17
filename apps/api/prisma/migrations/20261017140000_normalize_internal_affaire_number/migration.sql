UPDATE "Chantier" SET "internalAffaireNumber" = UPPER(TRIM("internalAffaireNumber"));

CREATE INDEX "Chantier_internalAffaireNumber_idx" ON "Chantier"("internalAffaireNumber");
